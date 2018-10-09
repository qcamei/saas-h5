import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {AppUtils} from "../../../../comModule/AppUtils";
import {ChainPackageProjectMgr} from "../../../../bsModule/chainPackageProject/chainPackageProjectMgr";
import {ChainPackageProjectSynDataHolder} from "../../../../bsModule/chainPackageProject/chainPackageProjectSynDataHolder";
import {PackageProjectAddForm} from "../../../../bsModule/chainPackageProject/apiData/PackageProjectAddForm";
import {PromptMsg} from "../../../common/Util/PromptMsg";
import {AppRouter} from "../../../../comModule/AppRouter";
import {PackageProjectType} from "../../../../bsModule/chainPackageProject/data/PackageProjectType";
import {Constants} from "../../../common/Util/Constants";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {ChainPackageProject} from "../../../../bsModule/chainPackageProject/data/ChainPackageProject";
import {BusinessUtil} from "../../../common/Util/BusinessUtil";
import {ProductData} from "../../comp/packageContentComp/PackageContentCompViewData";
import {ItemTypeEnum} from "../../../../comModule/enum/ItemTypeEnum";
import {PackageStateEnum} from "../../../../bsModule/chainPackageProject/data/PackageStateEnum";
import {ChainPackageProjectViewDataMgr} from "../../StorePackageProjectViewDataMgr";
import {PackageItem} from "../../../../bsModule/chainPackageProject/data/PackageItem";
import {PackageItemEnum} from "../../../../bsModule/chainPackageProject/data/PackageItemEnum";
import {Store} from "../../../../bsModule/store/data/Store";
import {StoreListComp} from "../../../productionLibrary/Comp/storeListComp/StoreListComp";
import {StoreMgr} from "../../../../bsModule/store/storeMgr";
import {Chain} from "../../../../bsModule/chain/data/Chain";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../../zmComp/modal/ZmModalMgr";
import {AddPackageTypeWithReturnComp} from "../../comp/addTypeWithReturn/addPackageTypeWithReturn";
import {AppCfg} from "../../../../comModule/AppCfg";

@Component({
  selector: 'add-package',
  templateUrl: 'addPackage.html',
})
export class AddPackageComp implements OnInit {
  private service: AddPackageService;
  public viewData: AddPackageViewData;
  private viewDataSub: any;
  public packageContentList: Array<ProductData> = new Array<ProductData>();


  constructor(private chainPackageProjectMgr: ChainPackageProjectMgr,
              private chainPackageProjectSynDataHolder: ChainPackageProjectSynDataHolder,
              private chainPackageProjectViewDataMgr: ChainPackageProjectViewDataMgr,
              private storeMgr: StoreMgr,
              private cdRef: ChangeDetectorRef,
              private matDialog: MatDialog) {
    ZmModalMgr.getInstance().reset(matDialog);

    this.service = new AddPackageService(
      this.chainPackageProjectMgr,
      this.chainPackageProjectSynDataHolder,
      this.chainPackageProjectViewDataMgr,
      this.storeMgr);
  }

  ngOnInit() {
    this.viewDataSub = this.chainPackageProjectViewDataMgr.subscribeAddPackageVD((viewDataP: AddPackageViewData) => {
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

    if (this.viewData.pageData.defaultImg == Constants.PACKAGE_DEFAULT_IMG) {
      AppUtils.removeFromArray(this.viewData.pageData.imgUrl, this.viewData.pageData.defaultImg);
    }
    if (imgArr.length != 0) {
      this.viewData.pageData.imgUrl = this.viewData.pageData.imgUrl.concat(imgArr);
      this.viewData.pageData.limitCount -= imgArr.length;
    }
  }


  /**
   * 新建套餐分类
   */
  addPackageType() {
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
    let chainId = SessionUtil.getInstance().getChainId();
    this.chainPackageProjectMgr.getChainPackageProject(chainId).then(
      (chainPackageProject) => {
        this.viewData.typeList = chainPackageProject.getValidPackageTypeMap().values();
        this.addFormData.typeId = Constants.PACKAGE_TYPE_PREFIX +chainId+"_"+ addTypeId;
        this.service.handleViewData(this.viewData);
      });
  }

  /**
   * 分配
   */
  public selectStore() {
    let modalData = {storeList:this.viewData.storeList};
    let tmp = this;
    let callBack = (storeList:Array<StoreVD>) => {
      tmp.getSelectedStore(storeList);//回调刷新列表
    };
    ZmModalMgr.getInstance().newModal(StoreListComp,modalData,callBack);
  }

  private getSelectedStore(storeList: Array<StoreVD>) {
    this.viewData.selectStoreList = storeList;
    this.viewData.selectStoreIds = storeList.map((item) => {
      return item.id;
    });
  }

  public removeStore() {
    this.viewData.selectStoreIds = this.viewData.selectStoreList.map((item) => {
      return item.id;
    });
  }

  /**
   * 自动计算 单个平均价格
   */
  autoSetDiscount() {

    if (!this.addFormData.sellPrice) {
      return;
    }
    if (this.packageContentList.length==0) {
      return;
    }
    let priceData = new PriceData();
    priceData.price = this.addFormData.sellPrice;
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
  public addFormData = new PackageProjectAddForm();

  public async addPackage() {
    let successForm = this.checkForm();

    if (successForm) {
      this.buildAddForm();
      let success = await this.service.addPackage(this.addFormData);
      this.handleResult(success);
    }

  }

  /**
   * 表单验证
   */
  private checkForm(): boolean {
    this.checkNumber();
    let checkSuccess = true;
    if (AppUtils.isNullOrWhiteSpace(this.viewData.pageData.defaultNumber)
      || AppUtils.isNullObj(this.addFormData.typeId)
      || AppUtils.isNullOrWhiteSpace(this.addFormData.name)
      || AppUtils.isNullObj(this.addFormData.sellPrice)
      || this.viewData.pageData.isExitNumber == true) {
      AppUtils.showWarn("提示", "必填项未按要求填写");
      checkSuccess = false;
    }
    if (this.packageContentList.length == 0) {
      AppUtils.showWarn("提示", "请选择套餐内容");
      return;
    }

    if (this.addFormData.sellPrice > this.viewData.pageData.totalPrice) {
      AppUtils.showWarn("提示", "套餐售价不能大于产品总价");
      return;
    }
    return checkSuccess;
  }

  /**
   * 检查编号number唯一性
   * */
  checkNumber() {
    if (!AppUtils.isNullOrWhiteSpace(this.viewData.pageData.defaultNumber)) {
      let number = AppUtils.trimBlank(this.viewData.pageData.defaultNumber);
      let numberList: Array<string> = this.viewData.packageNumberList;
      if (AppUtils.arrayContains(numberList, number)) {
        this.viewData.pageData.isExitNumber = true;
      } else {
        this.viewData.pageData.isExitNumber = false;
      }
    }

  }

  private buildAddForm() {
    (this.viewData.pageData.state == true) ? this.addFormData.state = PackageStateEnum.Open : this.addFormData.state = PackageStateEnum.Close;
    this.addFormData.number = AppUtils.trimBlank(this.viewData.pageData.defaultNumber);
    this.addFormData.index = this.viewData.pageData.index;
    this.addFormData.imgPaths = this.viewData.pageData.imgUrl;
    this.addFormData.defaultImg = this.viewData.pageData.imgUrl[0];
    this.addFormData.packageItems = this.buildPackageItems();
    this.addFormData.applyStoreIds = this.viewData.selectStoreIds;
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
  private handleResult(successP: boolean): void {
    if (successP) {
      AppUtils.showSuccess(PromptMsg.PROMPT, PromptMsg.NEW_SUCCESS);
      AppRouter.goPackageList();
    } else {
      AppUtils.showError(PromptMsg.PROMPT, PromptMsg.NEW_ERROR);
    }
  }

}

class AddPackageService {

  constructor(private chainPackageProjectMgr: ChainPackageProjectMgr,
              private chainPackageProjectSynDataHolder: ChainPackageProjectSynDataHolder,
              private chainPackageProjectViewDataMgr: ChainPackageProjectViewDataMgr,
              private storeMgr: StoreMgr,) {
  }

  public initViewData(): void {
    this.chainPackageProjectViewDataMgr.setAddPackageViewData(new AddPackageViewData());

    this.buildViewData().then(
      (viewDataP) => {
        this.handleViewData(viewDataP);
      }).catch(error => {
      AppUtils.handleError(error);
    });
  }

  public handleViewData(viewDataP: AddPackageViewData) {
    this.chainPackageProjectViewDataMgr.setAddPackageViewData(viewDataP);
  }


  /**
   * 组装viewData
   * @param chainId
   * @returns Promise<AddPackageViewData>
   */
  public async buildViewData(): Promise<AddPackageViewData> {
    let chainId = SessionUtil.getInstance().getChainId();
    let viewDataTmp = new AddPackageViewData();

    let pageResp = await this.storeMgr.findStoreByCond(chainId);
    if(pageResp){
      viewDataTmp.storeList = pageResp.list.map((store)=>{
        return StoreVD.fromStore(store);
      });
    }

    let ChainPackageProject: ChainPackageProject = await this.chainPackageProjectSynDataHolder.getData(chainId);
    viewDataTmp.typeList = ChainPackageProject.getValidPackageTypeMap().values();

    let packageList = ChainPackageProject.getValidPackageProjectMap().values();
    for (let item of packageList) {
      viewDataTmp.packageNumberList.push(item.number);
    }

    let packageIdIndex: number = await this.getPackageIdIndex(chainId);
    viewDataTmp.pageData.index = parseInt(packageIdIndex.toString()) + 1;
    viewDataTmp.pageData.requestUrl = AppCfg.getInstance().getServiceAddress() + "/img/saveImgs/img/goods/" + chainId + "_" + packageIdIndex;
    viewDataTmp.pageData.imgUrl.push(viewDataTmp.pageData.defaultImg);

    let tmpNo: number = 10000001 + parseInt(packageIdIndex + "");
    let tmpStr = BusinessUtil.numToStr(tmpNo, "C");
    viewDataTmp.pageData.defaultNumber = tmpStr;

    if (AppUtils.arrayContains(viewDataTmp.packageNumberList, viewDataTmp.pageData.defaultNumber)) {
      viewDataTmp.pageData.defaultNumber = BusinessUtil.numToStr(tmpNo + 1, "C");
    }

    return new Promise<AddPackageViewData>(resolve => {
      resolve(viewDataTmp);
    });
  }


  /**
   *新建套餐方法
   *@param chainId:string
   *@param formData:AddPackageData
   *@returns Promise<boolean>
   */
  public addPackage(formData: PackageProjectAddForm): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.chainPackageProjectMgr.addPackageProject(formData).then(
        (success) => {
          resolve(success);
        }
      )
    });
  }

  /**
   * 获取packageIdIndex
   * @param   chainId:string
   * @returns Promise<number>
   */
  public getPackageIdIndex(chainId: string): Promise<number> {
    return new Promise<number>(resolve => {
      this.chainPackageProjectSynDataHolder.getData(chainId).then(
        (ChainPackageProject: ChainPackageProject) => {
          resolve(ChainPackageProject.packageProjectIndex);
        }
      );
    });
  }

}


export class AddPackageViewData {

  public typeList: Array<PackageProjectType> = new Array<PackageProjectType>();

  public packageNumberList: Array<string> = new Array<string>();//项目编号list

  public pageData: PageData = new PageData();


  public storeList: Array<StoreVD> = new Array<StoreVD>();
  public selectStoreList: Array<StoreVD> = new Array<StoreVD>();
  public selectStoreIds: Array<string> = new Array<string>();

  constructor() {
  }

}

export class StoreVD{
  id:string;
  bossId:number;
  name:string;
  lastUpdateTime:number;
  state:number;
  entityState:number;
  descript:string;
  area:string;
  address:string;
  tel:string;
  isChain:boolean = false;


  checked:boolean = false;
  dataPermission:boolean = true;//暂时全部都可以查看
  constructor(){}

  public static fromStore(store:Store){
    let storeVD = new StoreVD();
    AppUtils.copy(storeVD,store);
    return storeVD;
  };

  public static fromChain(chain:Chain){
    let storeVD = new StoreVD();
    storeVD.id = chain.id;
    storeVD.name = chain.name;
    storeVD.tel = chain.contactNumber;
    storeVD.area = chain.area;
    storeVD.isChain = true;
    storeVD.dataPermission = false;
    return storeVD;
  }
}

export class PageData {
  public index: number;
  public isExitNumber: boolean = false;
  public defaultNumber: string;
  public defaultNumberPass:boolean;
  public state: boolean = true;
  public totalPrice: number = 0;

  public requestUrl: string;//上传图片请求url
  public imgUrl: Array<string> = new Array<string>();
  public defaultImg: string = Constants.PACKAGE_DEFAULT_IMG;
  public limitCount: number = Constants.MAX_UPLOAD_IMG;
  public maxCount: number = Constants.MAX_UPLOAD_IMG;
}


export class PriceData {
  public totalPrice: number = 0;//原始总价
  public price: number = 0;//售价
}
