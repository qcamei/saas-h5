import {Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import {AppUtils} from "../../../../comModule/AppUtils";
import {StorePackageProjectMgr} from "../../../../bsModule/storePackageProject/StorePackageProjectMgr";
import {StorePackageProjectSynDataHolder} from "../../../../bsModule/storePackageProject/StorePackageProjectSynDataHolder";
import {StorePackageProjectViewDataMgr} from "../../StorePackageProjectViewDataMgr";
import {PackageProjectAddForm} from "../../../../bsModule/storePackageProject/apiData/PackageProjectAddForm";
import {PromptMsg} from "../../../common/Util/PromptMsg";
import {AppRouter} from "../../../../comModule/AppRouter";
import {PackageProjectType} from "../../../../bsModule/storePackageProject/data/PackageProjectType";
import {Constants} from "../../../common/Util/Constants";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {StorePackageProject} from "../../../../bsModule/storePackageProject/data/StorePackageProject";
import {BusinessUtil} from "../../../common/Util/BusinessUtil";
import {ProductData} from "../../comp/packageContentComp/PackageContentCompViewData";
import {PackageItem} from "../../../../bsModule/packageProjectDetail/data/PackageItem";
import {PackageItemEnum} from "../../../../bsModule/packageProjectDetail/data/PackageItemEnum";
import {ItemTypeEnum} from "../../../../comModule/enum/ItemTypeEnum";
import {PackageStateEnum} from "../../../../bsModule/storePackageProject/data/PackageStateEnum";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../../zmComp/modal/ZmModalMgr";
import {AppCfg} from "../../../../comModule/AppCfg";
import {AddPackageTypeWithReturnComp} from "../../addTypeWithReturn/addPackageTypeWithReturn";
import {RestResp} from "../../../../comModule/RestResp";
import {PromotionFlagEnum} from "../../../../comModule/enum/PromotionFlagEnum";

@Component({
  selector: 'add-package',
  templateUrl: 'addPackage.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddPackageComp implements OnInit {
  private service: AddPackageService;
  public viewData: AddPackageViewData;
  private viewDataSub: any;
  public packageContentList: Array<ProductData> = new Array<ProductData>();


  constructor(private storePackageProjectMgr: StorePackageProjectMgr,
              private storePackageProjectSynDataHolder: StorePackageProjectSynDataHolder,
              private storePackageProjectViewDataMgr: StorePackageProjectViewDataMgr,
              private cdRef: ChangeDetectorRef,
              private matDialog: MatDialog,) {
    ZmModalMgr.getInstance().reset(matDialog);

    this.service = new AddPackageService(
      this.storePackageProjectMgr,
      this.storePackageProjectSynDataHolder,
      this.storePackageProjectViewDataMgr);
  }

  ngOnInit() {
    this.viewDataSub = this.storePackageProjectViewDataMgr.subscribeAddPackageVD((viewDataP: AddPackageViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.service.initViewData();
  }

  ngOnDestroy() {
    if (!AppUtils.isNullObj(this.viewDataSub)) {
      this.viewDataSub.unsubscribe();
    }
  }

  /**
   * 上传图片回调函数
   */
  showImg(imgArr: Array<string>) {

    if (this.viewData.addFormData.defaultImg == Constants.PACKAGE_DEFAULT_IMG) {
      AppUtils.removeFromArray(this.viewData.addFormData.imgPaths, this.viewData.addFormData.defaultImg);
    }
    if (imgArr.length != 0) {
      this.viewData.addFormData.imgPaths = this.viewData.addFormData.imgPaths.concat(imgArr);
      this.viewData.pageData.limitCount -= imgArr.length;
    }
  }

  /**
   * 新建套餐分类
   */
  addType() {
    let modalData = {modalHeader: '新建分类',};
    let tmp = this;
    let callBack = (addTypeId:string) => {
      tmp.refreshTypeList(addTypeId);//回调刷新列表
    };
    ZmModalMgr.getInstance().newSmallModal(AddPackageTypeWithReturnComp,modalData,callBack);
  }

  /**
   * 新建套餐分类 回调刷新分类列表
   */
  private refreshTypeList(addTypeId: string) {
    let storeId = SessionUtil.getInstance().getStoreId();
    this.storePackageProjectMgr.getStorePackageProject(storeId).then(
      (storePackageProject) => {
        this.viewData.typeList = storePackageProject.getValidPackageTypeMap().values();
        this.viewData.addFormData.typeId = addTypeId;
        this.service.handleViewData(this.viewData);
      });
  }


  /**
   * 自动计算 单个平均价格
   */
  autoSetDiscount() {

    if (!this.viewData.addFormData.sellPrice) {
      return;
    }
    if (this.packageContentList.length == 0) {
      return;
    }
    let priceData = new PriceData();
    priceData.price = this.viewData.addFormData.sellPrice;
    this.packageContentList.forEach(item => {
      priceData.totalPrice += item.price * item.count;
      priceData.totalPrice = AppUtils.twoDecimal(priceData.totalPrice);
    });

    let rate: number = priceData.price / priceData.totalPrice;

    for (let item of this.packageContentList) {
      item.discountPrice = item.price * rate;
      item.discountPrice = AppUtils.twoDecimal(item.discountPrice);
      if (item.discountPrice > item.price) {
        item.discountPrice = item.price;
      }
    }
  }



  /**
   * 新建套餐点击事件
   */
  public async addPackage() {
    let successForm = this.checkForm();
    if (successForm) {
      this.buildAddForm();
      let restResp:RestResp = await this.service.addPackage(this.viewData.addFormData);
      this.handleResult(restResp);
    }

  }

  /**
   * 表单验证
   */
  private checkForm(): boolean {
    let checkSuccess = true;
    if (AppUtils.isNullOrWhiteSpace(this.viewData.addFormData.number)
      || AppUtils.isNullOrWhiteSpace(this.viewData.addFormData.name)) {
      AppUtils.showWarn("提示", "必填项未按要求填写");
      checkSuccess = false;
    }
    if (this.packageContentList.length == 0) {
      AppUtils.showWarn("提示", "请选择套餐内容");
      return;
    }

    if (this.viewData.addFormData.sellPrice > this.viewData.pageData.totalPrice) {
      AppUtils.showWarn("提示", "套餐售价不能大于产品总价");
      return;
    }
    if(this.viewData.addFormData.promotionPrice>this.viewData.addFormData.sellPrice){
      AppUtils.showWarn("提示","促销价不能大于售价");
      return;
    }
    return checkSuccess;
  }

  private buildAddForm() {
    this.autoSetDiscount();
    (this.viewData.pageData.state == true) ? this.viewData.addFormData.state = PackageStateEnum.Open : this.viewData.addFormData.state = PackageStateEnum.Close;
    (this.viewData.pageData.promotionFlag == true) ? this.viewData.addFormData.promotionFlag = PromotionFlagEnum.Yes : this.viewData.addFormData.state = PromotionFlagEnum.No;
    this.viewData.addFormData.name = AppUtils.trimBlank(this.viewData.addFormData.name)
    this.viewData.addFormData.number = AppUtils.trimBlank(this.viewData.addFormData.number);
    this.viewData.addFormData.defaultImg = this.viewData.addFormData.imgPaths[0];
    this.viewData.addFormData.packageItems = this.buildPackageItems();
  }

  private buildPackageItems() {
    let packageItems: Array<PackageItem> = new Array<PackageItem>();
    for (let item of this.packageContentList) {
      let packageItem = new PackageItem();
      packageItem.pgId = item.id;
      item.type == ItemTypeEnum.PRODUCT ? packageItem.itemType = PackageItemEnum.PRODUCT : packageItem.itemType = PackageItemEnum.GOODS;
      packageItem.count = item.count;
      packageItem.discountPrice = item.discountPrice;
      packageItems.push(packageItem);
    }
    return packageItems;
  }


  /**
   * 处理结果
   */
  private handleResult(restResp:RestResp): void {
    if (!AppUtils.isNullObj(restResp)){
      if(restResp.code == 200){
        AppUtils.showSuccess(PromptMsg.PROMPT, PromptMsg.NEW_SUCCESS);
        history.go(-1);
      }else if(restResp.code == 500){
        AppUtils.showError(PromptMsg.PROMPT,PromptMsg.NEW_ERROR);
      }else{
        AppUtils.showError(PromptMsg.PROMPT,restResp.tips);
      }
    }else{
      AppUtils.showError(PromptMsg.PROMPT,PromptMsg.NEW_ERROR);
    }
  }

}

class AddPackageService {

  constructor(private storePackageProjectMgr: StorePackageProjectMgr,
              private storePackageProjectSynDataHolder: StorePackageProjectSynDataHolder,
              private storePackageProjectViewDataMgr: StorePackageProjectViewDataMgr) {
  }

  public initViewData(): void {
    this.storePackageProjectViewDataMgr.setAddPackageViewData(new AddPackageViewData());

    this.buildViewData().then(
      (viewDataP) => {
        this.handleViewData(viewDataP);
      }).catch(error => {
      AppUtils.handleError(error);
    });
  }

  public handleViewData(viewDataP: AddPackageViewData) {
    this.storePackageProjectViewDataMgr.setAddPackageViewData(viewDataP);
  }


  /**
   * 组装viewData
   * @param storeId
   * @returns Promise<AddPackageViewData>
   */
  public async buildViewData(): Promise<AddPackageViewData> {
    let storeId = SessionUtil.getInstance().getStoreId();
    let viewDataTmp = new AddPackageViewData();
    let StorePackageProject: StorePackageProject = await this.storePackageProjectSynDataHolder.getData(storeId);
    viewDataTmp.typeList = StorePackageProject.getValidPackageTypeMap().values();
    if(viewDataTmp.typeList.length>0){
      viewDataTmp.addFormData.typeId = viewDataTmp.typeList[0].id;
    }

    let packageList = StorePackageProject.getValidPackageProjectMap().values();
    for (let item of packageList) {
      viewDataTmp.packageNumberList.push(item.number);
    }

    let packageIdIndex: number = await this.getPackageIdIndex(storeId);
    viewDataTmp.addFormData.index = parseInt(packageIdIndex.toString()) + 1;
    viewDataTmp.pageData.requestUrl = AppCfg.getInstance().getServiceAddress() + "/img/saveImgs/img/goods/" + storeId + "_" + packageIdIndex;
    viewDataTmp.addFormData.imgPaths.push(viewDataTmp.addFormData.defaultImg);


    let tmpNo: number = 10000001 + parseInt(packageIdIndex + "");
    let tmpStr = BusinessUtil.numToStr(tmpNo, "C");
    viewDataTmp.addFormData.number = tmpStr;

    if (AppUtils.arrayContains(viewDataTmp.packageNumberList, viewDataTmp.addFormData.number)) {
      viewDataTmp.addFormData.number = BusinessUtil.numToStr(tmpNo + 1, "C");
    }

    return new Promise<AddPackageViewData>(resolve => {
      resolve(viewDataTmp);
    });
  }


  /**
   *新建套餐方法
   *@param storeId:string
   *@param formData:AddPackageData
   *@returns Promise<boolean>
   */
  public addPackage(formData: PackageProjectAddForm): Promise<RestResp> {
    return new Promise<RestResp>(resolve => {
      this.storePackageProjectMgr.addPackageProject(formData).then(
        (restResp) => {
          resolve(restResp);
        }
      )
    });
  }

  /**
   * 获取packageIdIndex
   * @param   storeId:string
   * @returns Promise<number>
   */
  public getPackageIdIndex(storeId: string): Promise<number> {
    return new Promise<number>(resolve => {
      this.storePackageProjectSynDataHolder.getData(storeId).then(
        (StorePackageProject: StorePackageProject) => {
          resolve(StorePackageProject.packageProjectIndex);
        }
      );
    });
  }

}


export class AddPackageViewData {
  public addFormData = new PackageProjectAddForm();
  public typeList: Array<PackageProjectType> = new Array<PackageProjectType>();

  public packageNumberList: Array<string> = new Array<string>();//项目编号list

  public pageData: PageData = new PageData();

  constructor() {
  }

}

export class PageData {

  public state: boolean = true;
  public promotionFlag:boolean = false;
  public totalPrice: number = 0;

  public requestUrl: string;//上传图片请求url
  public limitCount: number = Constants.MAX_UPLOAD_IMG;
  public maxCount: number = Constants.MAX_UPLOAD_IMG;
}


export class PriceData {
  public totalPrice: number = 0;//原始总价
  public price: number = 0;//售价
}
