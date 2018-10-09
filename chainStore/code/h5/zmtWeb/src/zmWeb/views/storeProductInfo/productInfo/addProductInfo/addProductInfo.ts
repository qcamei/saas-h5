import {Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, OnDestroy} from "@angular/core";
import {AppUtils} from "../../../../comModule/AppUtils";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {BusinessUtil} from "../../../common/Util/BusinessUtil";
import {AppCfg} from "../../../../comModule/AppCfg";
import {Constants} from "../../../common/Util/Constants";
import {PromptMsg} from "../../../common/Util/PromptMsg";
import {StoreProductInfoMgr} from "../../../../bsModule/StoreProductInfo/StoreProductInfoMgr";
import {StoreProductInfoSynDataHolder} from "../../../../bsModule/StoreProductInfo/StoreProductInfoSynDataHolder";
import {AddProductInfoData} from "../../../../bsModule/StoreProductInfo/apiData/AddProductInfoData";
import {StoreProductInfoViewDataMgr} from "../../storeProductViewDataMgr";
import {ProductType} from "../../../../bsModule/StoreProductInfo/data/ProductType";
import {StoreProductInfo} from "../../../../bsModule/StoreProductInfo/data/StoreProductInfo";
import {ZmModalMgr} from "../../../zmComp/modal/ZmModalMgr";
import {AddProductTypeWithReturnComp} from "../comp/addProductTypeWithReturn";
import {MatDialog} from "@angular/material";
import {RestResp} from "../../../../comModule/RestResp";


@Component({
  selector: 'page-storePro-addProduct',
  templateUrl: 'addProductInfo.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AddProductInfoPage implements OnInit,OnDestroy {

  private service: AddProductInfoService;
  public viewData: AddProductInfoViewData;
  private viewDataSub: any;

  constructor(private storeProductInfoMgr: StoreProductInfoMgr,
              private storeProductInfoSynDataHolder: StoreProductInfoSynDataHolder,
              private storeProductInfoViewDataMgr: StoreProductInfoViewDataMgr,
              private cdRef: ChangeDetectorRef,
              private matDialog: MatDialog) {
    ZmModalMgr.getInstance().reset(matDialog);

    this.service = new AddProductInfoService(
      this.storeProductInfoMgr,
      this.storeProductInfoSynDataHolder,
      this.storeProductInfoViewDataMgr);
  }

  ngOnInit() {
    this.viewDataSub = this.storeProductInfoViewDataMgr.subscribeAddProductInfoVD((viewDataP: AddProductInfoViewData) => {
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
   * 上传失败，返回空数组
   */
  showImg(imgArr: Array<string>) {
    if (this.viewData.addFormData.defaultImg == Constants.PRODUCT_DEFAULT_IMG) {
      AppUtils.removeFromArray(this.viewData.addFormData.imgPathList, this.viewData.addFormData.defaultImg);
    }
    if (imgArr.length != 0) {
      this.viewData.addFormData.imgPathList = this.viewData.addFormData.imgPathList.concat(imgArr);
      this.viewData.limitCount -= imgArr.length;
    }
  }

  public addType() {
    let modalData = {modalHeader: '新建分类',};
    let tmp = this;
    let callBack = (addTypeId: string) => {
      tmp.refreshTypeList(addTypeId);//回调刷新列表
    };
    ZmModalMgr.getInstance().newSmallModal(AddProductTypeWithReturnComp, modalData, callBack);
  }

  private refreshTypeList(addTypeId: string) {
    let storeId = SessionUtil.getInstance().getStoreId();
    this.storeProductInfoMgr.getStoreProductInfo(storeId).then(
      (storeProductInfo) => {
        this.viewData.typeList = storeProductInfo.getProductTypeMap().values();
        this.viewData.addFormData.typeId = addTypeId;
        this.service.handleViewData(this.viewData);
      });
  }

  /**
   * 新建项目点击事件
   */
  public async addProduct() {
    if(this.viewData.addFormData.promotionPrice>this.viewData.addFormData.price){
      AppUtils.showWarn("提示","促销价不能大于售价");
      return;
    }
    let addFormData = AddProductInfoData.fromAddViewData(this.viewData.addFormData);
    let restResp: RestResp = await this.service.addProduct(addFormData);
    this.handleResult(restResp);
  }

  private handleResult(restResp: RestResp): void {
    if (!AppUtils.isNullObj(restResp)) {
      if (restResp.code == 200) {
        AppUtils.showSuccess(PromptMsg.PROMPT, PromptMsg.NEW_SUCCESS);
        history.go(-1);
      } else if (restResp.code == 500) {
        AppUtils.showError(PromptMsg.PROMPT, PromptMsg.NEW_ERROR);
      } else {
        AppUtils.showError(PromptMsg.PROMPT, restResp.tips);
      }
    } else {
      AppUtils.showError(PromptMsg.PROMPT, PromptMsg.NEW_ERROR);
    }
  }

}

class AddProductInfoService {

  constructor(private storeProductInfoMgr: StoreProductInfoMgr,
              private storeProductInfoSynDataHolder: StoreProductInfoSynDataHolder,
              private storeProductInfoViewDataMgr: StoreProductInfoViewDataMgr) {
  }

  public initViewData(): void {
    this.storeProductInfoViewDataMgr.setAddProductInfoViewData(new AddProductInfoViewData());

    this.buildViewData().then(
      (viewDataP) => {
        this.handleViewData(viewDataP);
      }).catch(error => {
      AppUtils.handleError(error);
    });
  }

  public handleViewData(viewDataP: AddProductInfoViewData) {
    this.storeProductInfoViewDataMgr.setAddProductInfoViewData(viewDataP);
  }


  /**
   * 组装viewData
   * @param storeId
   * @returns Promise<AddProductInfoViewData>
   */
  public async buildViewData(): Promise<AddProductInfoViewData> {
    let storeId = SessionUtil.getInstance().getStoreId();
    let viewDataTmp = new AddProductInfoViewData();
    let StoreProductInfo: StoreProductInfo = await this.storeProductInfoSynDataHolder.getData(storeId);
    viewDataTmp.typeList = StoreProductInfo.getValidProductTypeList();
    if (viewDataTmp.typeList.length > 0) {
      viewDataTmp.addFormData.typeId = viewDataTmp.typeList[0].id;
    }
    let productInfoList = StoreProductInfo.getAllProductInfoList();
    for (let productInfo of productInfoList) {
      viewDataTmp.productNumberList.push(productInfo.number);
    }

    let productIdIndex: number = await this.getProductIdIndex(storeId);
    viewDataTmp.requestUrl = AppCfg.getInstance().getServiceAddress() + "/img/saveImgs/img/product/" + storeId + "_" + productIdIndex;

    viewDataTmp.addFormData.index = parseInt(productIdIndex.toString()) + 1;
    viewDataTmp.addFormData.imgPathList.push(viewDataTmp.addFormData.defaultImg);
    let tmpNo: number = 10000001 + parseInt(productIdIndex + "");
    let tmpStr = BusinessUtil.numToStr(tmpNo, "P");
    viewDataTmp.addFormData.number = tmpStr;
    if (AppUtils.arrayContains(viewDataTmp.productNumberList, viewDataTmp.addFormData.number)) {
      viewDataTmp.addFormData.number = BusinessUtil.numToStr(tmpNo + 1, "P");
    }

    return new Promise<AddProductInfoViewData>(resolve => {
      resolve(viewDataTmp);
    });
  }


  /**
   *新建项目方法
   *@param storeId:string
   *@param formData:AddProductInfoData
   *@returns Promise<boolean>
   */
  public addProduct(formData: AddProductInfoData): Promise<RestResp> {
    let storeId = SessionUtil.getInstance().getStoreId();
    formData.storeId = storeId;
    return this.storeProductInfoMgr.addProduct(formData);
  }

  /**
   * 获取productIdIndex,计算productId
   * @param   storeId:string
   * @returns Promise<number>
   */
  public getProductIdIndex(storeId: string): Promise<number> {
    return new Promise<number>(resolve => {
      this.storeProductInfoSynDataHolder.getData(storeId).then(
        (storeProductInfo) => {
          resolve(storeProductInfo.productIdIndex);
        }
      );
    });
  }
}

export class AddProductInfoViewData {
  public typeList: Array<ProductType> = new Array<ProductType>();
  public productNumberList: Array<string> = new Array<string>();//项目编号list

  public addFormData = new AddViewData();

  public requestUrl: string;//上传图片请求url
  public limitCount: number = Constants.MAX_UPLOAD_IMG;
  public maxCount: number = Constants.MAX_UPLOAD_IMG;

}
export class AddViewData {
  constructor() {
  }

  index: number;
  storeId: string;
  name: string;
  namePass: boolean;

  number: string;
  numberPass: boolean;

  typeId: string = "1";
  price: number = 0;
  cost: number = 0;
  state: boolean = true;
  descript: string;
  imgPathList: Array<string> = new Array<string>();
  defaultImg: string = Constants.PRODUCT_DEFAULT_IMG;
  promotionFlag: boolean = false;
  promotionPrice: number = 0;
}


