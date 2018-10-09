import {Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, OnDestroy} from "@angular/core";
import {AppUtils} from "../../../../comModule/AppUtils";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {BusinessUtil} from "../../../common/Util/BusinessUtil";
import {AppCfg} from "../../../../comModule/AppCfg";
import {Constants} from "../../../common/Util/Constants";
import {PromptMsg} from "../../../common/Util/PromptMsg";
import {ChainProductViewDataMgr} from "../../chainProductViewDataMgr";
import {ProductStateEnum} from "../../../../bsModule/chainProduct/data/ProductStateEnum";
import {ProductType} from "../../../../bsModule/chainProduct/data/ProductType";
import {ChainProductMgr} from "../../../../bsModule/chainProduct/chainProductMgr";
import {ChainProductSynDataHolder} from "../../../../bsModule/chainProduct/chainProductSynDataHolder";
import {ChainProduct} from "../../../../bsModule/chainProduct/data/ChainProduct";
import {AddProductInfoData} from "../../../../bsModule/chainProduct/apiData/AddProductInfoData";
import {StoreListComp} from "../../../productionLibrary/Comp/storeListComp/StoreListComp";
import {StoreMgr} from "../../../../bsModule/store/storeMgr";
import {PageResp} from "../../../../comModule/PageResp";
import {StoreVD} from "../../../chainPackageProject/packageProject/addPackage/addPackage";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../../zmComp/modal/ZmModalMgr";
import {AddProdcutTypeWithReturnComp} from "../comp/addProductTypeWithReturn";


@Component({
  selector: 'page-storePro-addProduct',
  templateUrl: 'addProductInfo.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AddProductInfoPage implements OnInit,OnDestroy {

  private service: AddProductInfoService;
  public viewData: AddProductInfoViewData;
  private viewDataSub: any;


  constructor(private chainProductMgr: ChainProductMgr,
              private chainProductSynDataHolder: ChainProductSynDataHolder,
              private chainProductViewDataMgr: ChainProductViewDataMgr,
              private storeMgr: StoreMgr,
              private cdRef: ChangeDetectorRef,
              private matDialog: MatDialog) {
    ZmModalMgr.getInstance().reset(matDialog);

    this.service = new AddProductInfoService(
      this.chainProductMgr,
      this.chainProductSynDataHolder,
      this.chainProductViewDataMgr,
      this.storeMgr);
  }

  ngOnInit() {
    this.viewDataSub = this.chainProductViewDataMgr.subscribeAddProductInfoVD((viewDataP: AddProductInfoViewData) => {
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
      this.viewData.pageData.limitCount -= imgArr.length;
    }
  }

  /**
   * 新建项目点击事件
   */
  public async addProduct() {
    let addForm = this.buildAddForm();
    let success = await this.service.addPrd(addForm);
    this.handleResult(success);
  }


  private buildAddForm() {
    let addFormData = new AddProductInfoData();
    AppUtils.copy(addFormData,this.viewData.addFormData);
    (this.viewData.pageData.state === true) ? this.viewData.addFormData.state = ProductStateEnum.Open : this.viewData.addFormData.state = ProductStateEnum.Close;
    addFormData.name = AppUtils.trimBlank(this.viewData.addFormData.name);
    addFormData.number = AppUtils.trimBlank(this.viewData.addFormData.number);
    addFormData.defaultImg = this.viewData.addFormData.imgPathList[0];
    addFormData.applyStoreIds = this.viewData.selectStoreIds;
    return addFormData;
  }

  /**
   * 新建分类
   */
  public addProductType() {
    let modalData = {modalHeader: '新建分类',};
    let tmp = this;
    let callBack = (addTypeId: string) => {
      tmp.refreshTypeList(addTypeId);//回调刷新列表
    };
    ZmModalMgr.getInstance().newSmallModal(AddProdcutTypeWithReturnComp, modalData, callBack);
  }

  private refreshTypeList(addTypeId: string) {
    let chainId = SessionUtil.getInstance().getChainId();
    this.chainProductMgr.getChainProduct(chainId).then(
      (chainProduct) => {
        this.viewData.typeList = chainProduct.getValidProductTypeMap().values();
        this.viewData.addFormData.typeId = Constants.PRODUCT_TYPE_PREFIX + chainId + "_" + addTypeId;
        this.service.handleViewData(this.viewData);
      });
  }


  /**
   * 分配
   */
  public selectStore() {

    let modalData = {storeList: this.viewData.storeList};
    let tmp = this;
    let callBack = (storeList: Array<StoreVD>) => {
      tmp.getSelectedStore(storeList);//回调刷新列表
    };
    ZmModalMgr.getInstance().newModal(StoreListComp, modalData, callBack);
  }

  private getSelectedStore(storeList: Array<StoreVD>) {
    this.viewData.selectStoreList = storeList;
    this.viewData.selectStoreIds = storeList.map((item) => {
      return item.id;
    });
    this.service.handleViewData(this.viewData);
  }

  public removeStore() {
    this.viewData.selectStoreIds = this.viewData.selectStoreList.map((item) => {
      return item.id;
    });
  }

  /**
   * 处理结果
   */
  private handleResult(successP: boolean): void {
    if (successP) {
      AppUtils.showSuccess(PromptMsg.PROMPT, PromptMsg.NEW_SUCCESS);
      history.go(-1);
    } else {
      AppUtils.showError(PromptMsg.PROMPT, PromptMsg.NEW_ERROR);
    }
  }

}


export class AddProductInfoViewData {

  public typeList: Array<ProductType> = new Array<ProductType>();
  public prdNumberList: Array<string> = new Array<string>();//项目编号list

  public addFormData = new AddProductInfoData();
  public pageData: PageData = new PageData();

  public storeList: Array<StoreVD> = new Array<StoreVD>();
  public selectStoreList: Array<StoreVD> = new Array<StoreVD>();
  public selectStoreIds: Array<string> = new Array<string>();

  constructor() {
  }

}

class PageData {
  // public index: number;
  public state: boolean = true;

  public requestUrl: string;//上传图片请求url
  public limitCount: number = Constants.MAX_UPLOAD_IMG;
  public maxCount: number = Constants.MAX_UPLOAD_IMG;
}

class AddProductInfoService {

  constructor(private chainProductMgr: ChainProductMgr,
              private chainProductSynDataHolder: ChainProductSynDataHolder,
              private chainProductViewDataMgr: ChainProductViewDataMgr,
              private storeMgr: StoreMgr,) {
  }

  public initViewData(): void {
    this.chainProductViewDataMgr.setAddProductInfoViewData(new AddProductInfoViewData());

    this.buildViewData().then(
      (viewDataP) => {
        this.handleViewData(viewDataP);
      }).catch(error => {
      AppUtils.handleError(error);
    });
  }

  public handleViewData(viewDataP: AddProductInfoViewData) {
    this.chainProductViewDataMgr.setAddProductInfoViewData(viewDataP);
  }


  /**
   * 组装viewData
   * @param chainId
   * @returns Promise<AddProductInfoViewData>
   */
  public async buildViewData(): Promise<AddProductInfoViewData> {
    let chainId = SessionUtil.getInstance().getChainId();
    let viewDataTmp = new AddProductInfoViewData();
    let pageResp: PageResp = await this.storeMgr.findStoreByCond(chainId);
    if (pageResp) {
      viewDataTmp.storeList = pageResp.list.map((store) => {
        return StoreVD.fromStore(store);
      });
    }

    let chainProduct: ChainProduct = await this.chainProductSynDataHolder.getData(chainId);
    viewDataTmp.typeList = chainProduct.getValidProductTypeMap().values();
    if(viewDataTmp.typeList && viewDataTmp.typeList.length>0){
      viewDataTmp.addFormData.typeId = viewDataTmp.typeList[0].id;
    }

    let prdInfoList = chainProduct.getAllProductMap().values();
    for (let prdInfo of prdInfoList) {
      viewDataTmp.prdNumberList.push(prdInfo.number);
    }

    let productIdIndex: number = await this.getProductIdIndex(chainId);
    viewDataTmp.addFormData.index = parseInt(productIdIndex.toString()) + 1;
    viewDataTmp.pageData.requestUrl = AppCfg.getInstance().getServiceAddress() + "/img/saveImgs/img/product/" + chainId + "_" + productIdIndex;
    viewDataTmp.addFormData.imgPathList.push(viewDataTmp.addFormData.defaultImg);

    let tmpNo: number = 10000001 + parseInt(productIdIndex + "");
    let tmpStr = BusinessUtil.numToStr(tmpNo, "P");
    viewDataTmp.addFormData.number = tmpStr;
    if (AppUtils.arrayContains(viewDataTmp.prdNumberList, viewDataTmp.addFormData.number)) {
      viewDataTmp.addFormData.number = BusinessUtil.numToStr(tmpNo + 1, "P");
    }

    return new Promise<AddProductInfoViewData>(resolve => {
      resolve(viewDataTmp);
    });
  }


  /**
   *新建项目方法
   *@param chainId:string
   *@param formData:AddProductInfoData
   *@returns Promise<boolean>
   */
  public addPrd(formData: AddProductInfoData): Promise<boolean> {
    let chainId = SessionUtil.getInstance().getChainId();
    return new Promise<boolean>(resolve => {
      this.chainProductMgr.addProduct(chainId, formData).then(
        (success) => {
          resolve(success);
        }
      )
    });
  }

  /**
   * 获取prdIdIndex,计算prdId
   * @param   chainId:string
   * @returns Promise<number>
   */
  public getProductIdIndex(chainId: string): Promise<number> {
    return new Promise<number>(resolve => {
      this.chainProductSynDataHolder.getData(chainId).then(
        (chainProduct) => {
          resolve(chainProduct.productIdIndex);
        }
      );
    });
  }

}
