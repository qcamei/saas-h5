import {Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, OnDestroy} from "@angular/core";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {AppUtils} from "../../../../comModule/AppUtils";
import {ActivatedRoute, Router} from "@angular/router";
import {AppCfg} from "../../../../comModule/AppCfg";
import {Constants} from "../../../common/Util/Constants";
import {PromptMsg} from "../../../common/Util/PromptMsg";
import {ChainProductViewDataMgr} from "../../chainProductViewDataMgr";
import {AppRouter} from "../../../../comModule/AppRouter";
import {ChainProductMgr} from "../../../../bsModule/chainProduct/chainProductMgr";
import {ChainProductSynDataHolder} from "../../../../bsModule/chainProduct/chainProductSynDataHolder";
import {ChainProductDetailCacheSynHolder} from "../../../../bsModule/chainProduct/chainProductDetailCacheSynHolder";
import {UpdateProductInfoData} from "../../../../bsModule/chainProduct/apiData/UpdateProductInfoData";
import {ProductStateEnum} from "../../../../bsModule/chainProduct/data/ProductStateEnum";
import {ProductDetail} from "../../../../bsModule/chainProduct/data/ProductDetail";
import {ProductType} from "../../../../bsModule/chainProduct/data/ProductType";
import {ChainProduct} from "../../../../bsModule/chainProduct/data/ChainProduct";
import {StoreMgr} from "../../../../bsModule/store/storeMgr";
import {StoreListComp} from "../../../productionLibrary/Comp/storeListComp/StoreListComp";
import {PageResp} from "../../../../comModule/PageResp";
import {StoreVD} from "../../../chainPackageProject/packageProject/addPackage/addPackage";
import {AddProdcutTypeWithReturnComp} from "../comp/addProductTypeWithReturn";
import {ZmModalMgr} from "../../../zmComp/modal/ZmModalMgr";
import {MatDialog} from "@angular/material";


@Component({
  selector: 'page-storePrd-updateProduct',
  templateUrl: 'editProductInfo.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class EditProductInfoPage implements OnInit,OnDestroy {

  private service: EditProductInfoService;
  public viewData: EditProductInfoViewData;
  private viewDataSub: any;
  private paramsSub: any;
  public state: number;

  constructor(private chainProductMgr: ChainProductMgr,
              private chainProductSynDataHolder: ChainProductSynDataHolder,
              private chainProductViewDataMgr: ChainProductViewDataMgr,
              private chainProductDetailCacheSynHolder: ChainProductDetailCacheSynHolder,
              private storeMgr: StoreMgr,
              private cdRef: ChangeDetectorRef,
              public route: ActivatedRoute,
              public router: Router,
              private matDialog: MatDialog){

    ZmModalMgr.getInstance().reset(matDialog);

    this.service = new EditProductInfoService(
      this.chainProductMgr,
      this.chainProductSynDataHolder,
      this.chainProductViewDataMgr,
      this.chainProductDetailCacheSynHolder,
      this.storeMgr,
    );
  }

  ngOnInit() {
    this.viewDataSub = this.chainProductViewDataMgr.subscribeEditProductInfoVD((viewDataP: EditProductInfoViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.paramsSub = this.route.params.subscribe(params => {
      let productDetailId = params['productId'];
      this.service.initViewData(productDetailId);
    });
  }

  ngOnDestroy() {
    if (AppUtils.isNullObj(this.paramsSub)) {
      this.paramsSub.unsubscribe();  //反订阅 防止内存泄露
    }
    if (AppUtils.isNullObj(this.paramsSub)) {
      this.viewDataSub.unsubscribe();
    }
  }

  /**
   * 上传图片回调函数
   */
  showImg(imgArr: Array<string>) {

    if (imgArr.length != 0 ) {
      if (this.viewData.defaultImg == Constants.PRODUCT_DEFAULT_IMG) {
        AppUtils.removeFromArray(this.viewData.imgPathListTmp, this.viewData.defaultImg);

      }
      this.viewData.imgPathListTmp = this.viewData.imgPathListTmp.concat(imgArr);
      this.viewData.limitCount = Constants.MAX_UPLOAD_IMG - this.viewData.imgPathListTmp.length;
    }
  }

  /**
   * 新建分类
   * */
  addProductType() {
    let modalData = {modalHeader: '新建分类',};
    let tmp = this;
    let callBack = (addTypeId:string) => {
      tmp.refreshTypeList(addTypeId);//回调刷新列表
    };
    ZmModalMgr.getInstance().newSmallModal(AddProdcutTypeWithReturnComp,modalData,callBack);
  }

  private refreshTypeList(addTypeId: string) {
    let chainId = SessionUtil.getInstance().getChainId();
    this.chainProductMgr.getChainProduct(chainId).then(
      (chainPackageProject) => {
        this.viewData.typeList = chainPackageProject.getValidProductTypeMap().values();
        this.viewData.productDetail.typeId = Constants.PRODUCT_TYPE_PREFIX +chainId+"_"+ addTypeId;
        this.service.handleViewData(this.viewData);
      });
  }

  /**
   * 分配
   * */
  public selectStore() {
    let modalData = {storeList:this.viewData.storeList};
    let tmp = this;
    let callBack = (storeList:Array<StoreVD>) => {
      tmp.getSelectedStore(storeList);//回调刷新列表
    };
    ZmModalMgr.getInstance().newModal(StoreListComp,modalData,callBack);
  }

  getSelectedStore(storeList: Array<StoreVD>) {
    this.viewData.selectStoreList = new Array();
    this.viewData.selectStoreList = storeList;
    this.viewData.selectStoreIds = this.viewData.selectStoreList.map((item) => {
      return item.id;
    });
    this.service.handleViewData(this.viewData);
  }

  removeStore() {
    this.viewData.selectStoreIds = this.viewData.selectStoreList.map((item) => {
      return item.id;
    });
  }

  /**
   * 编辑项目 点击事件
   * @param prdId:number
   */
  public async updatePrd(productId: string) {
    let updateProductInfoData = this.buildUpdateProductInfoData(productId);
    let checkSuccess = this.checkForm(updateProductInfoData);
    if (checkSuccess) {
      updateProductInfoData.name = AppUtils.trimBlank(updateProductInfoData.name);
      let success = await this.service.editProductInfo(updateProductInfoData);
      this.handleResult(success);
    }
  }

  private checkForm(updateProductInfoData): boolean {
    let checkSuccess = true;
    if (AppUtils.isNullObj(updateProductInfoData.typeId)
      || AppUtils.isNullOrWhiteSpace(updateProductInfoData.name)
      || AppUtils.isNullOrWhiteSpace(updateProductInfoData.number)
      || AppUtils.isNullObj(updateProductInfoData.sellPrice)
      || AppUtils.isNullObj(updateProductInfoData.cost)
      || AppUtils.isNullObj(updateProductInfoData.state)) {
      AppUtils.showWarn("提示", "必填项未填写");
      checkSuccess = false;
    }
    return checkSuccess;
  }


  /**组装UpdateProductInfoData*/
  private buildUpdateProductInfoData(productId: string) {
    let updateProductInfoData: UpdateProductInfoData = new UpdateProductInfoData();

    this.viewData.state == true ? updateProductInfoData.state = ProductStateEnum.Open : updateProductInfoData.state = ProductStateEnum.Close;
    updateProductInfoData.id = productId;
    updateProductInfoData.imgPathList = this.viewData.imgPathListTmp;
    updateProductInfoData.defaultImg = this.viewData.imgPathListTmp[0];
    updateProductInfoData.number = this.viewData.defaultNumber;
    updateProductInfoData.name = this.viewData.productDetail.name;
    updateProductInfoData.cost = this.viewData.productDetail.cost;
    updateProductInfoData.sellPrice = this.viewData.productDetail.sellPrice;
    updateProductInfoData.typeId = this.viewData.productDetail.typeId;
    updateProductInfoData.descript = this.viewData.productDetail.descript;
    updateProductInfoData.applyStoreIds = this.viewData.selectStoreIds;
    return updateProductInfoData;
  }

  /**
   * 处理结果
   */
  private handleResult(successP: boolean): void {
    if (successP) {
      AppUtils.showSuccess(PromptMsg.PROMPT, PromptMsg.EDIT_SUCCESS);
      AppRouter.goProductInfoList();
    } else {
      AppUtils.showError(PromptMsg.PROMPT, PromptMsg.EDIT_ERROR);
    }
  }
}


export class EditProductInfoViewData {
  public productDetail: ProductDetail = new ProductDetail();
  public typeList: Array<ProductType> = new Array<ProductType>();
  public state: boolean;//上下架状态

  public prdNumberList: Array<string> = new Array<string>();//项目编号list
  public defaultNumber: string;
  public defaultNumberPass: boolean;

  public requestUrl: string;
  public imgPathListTmp: Array<string> = new Array<string>();
  public defaultImg: string = Constants.PRODUCT_DEFAULT_IMG;
  public limitCount: number = Constants.MAX_UPLOAD_IMG;
  public maxCount: number = Constants.MAX_UPLOAD_IMG;


  public storeList: Array<StoreVD> = new Array<StoreVD>();
  public selectStoreList: Array<StoreVD> = new Array<StoreVD>();
  public selectStoreIds: Array<string> = new Array<string>();


}

class EditProductInfoService {

  constructor(private chainProductMgr: ChainProductMgr,
              private chainProductSynDataHolder: ChainProductSynDataHolder,
              private chainProductViewDataMgr: ChainProductViewDataMgr,
              private chainProductDetailCacheSynHolder: ChainProductDetailCacheSynHolder,
              private storeMgr: StoreMgr,) {
  }

  public initViewData(productDetailId: number): void {

    this.chainProductViewDataMgr.setEditProductInfoViewData(new EditProductInfoViewData());

    this.buildViewData(productDetailId).then((viewDataTmp: EditProductInfoViewData) => {
      this.handleViewData(viewDataTmp);
    }).catch(error => {
      AppUtils.handleError(error);
    });
  }

  public handleViewData(viewDataP: EditProductInfoViewData) {
    this.chainProductViewDataMgr.setEditProductInfoViewData(viewDataP);
  }


  public async buildViewData(productDetailId: number): Promise<EditProductInfoViewData> {

    let chainId = SessionUtil.getInstance().getChainId();
    let viewDataTmp: EditProductInfoViewData = new EditProductInfoViewData();
    let chainProduct: ChainProduct = await this.chainProductSynDataHolder.getData(chainId);
    viewDataTmp.typeList = chainProduct.getValidProductTypeMap().values();
    let prdInfoList = chainProduct.getAllProductMap().values();
    for (let prdInfo of prdInfoList) {
      viewDataTmp.prdNumberList.push(prdInfo.number);
    }
    viewDataTmp.requestUrl = AppCfg.getInstance().getServiceAddress() + "/img/saveImgs/img/product/" + productDetailId;

    let productDetailTmp: ProductDetail = await this.chainProductDetailCacheSynHolder.getData(productDetailId.toString());
    let productDetail = new ProductDetail();
    AppUtils.copy(productDetail, productDetailTmp);

    let pageResp: PageResp = await this.storeMgr.findStoreByCond(chainId);
    if(pageResp){
      viewDataTmp.storeList = pageResp.list.map((store)=>{
        return StoreVD.fromStore(store);
      });
    }

    if (productDetail) {
      viewDataTmp = this.buildVDataFromTargetPrd(viewDataTmp, productDetail);

      viewDataTmp.selectStoreList = this.getSelectStoreList(viewDataTmp.storeList, viewDataTmp.productDetail.applyStoreIds);
      viewDataTmp.selectStoreIds = viewDataTmp.selectStoreList.map((item) => {
        return item.id;
      });
    }

    return new Promise<EditProductInfoViewData>(resolve => {
      resolve(viewDataTmp);
    });
  }

  private getSelectStoreList(storeList: Array<StoreVD>, applyStoreIds: Array<string>) {
    let storeListTmp = new Array<StoreVD>();
    if (applyStoreIds) {
      for (let id of applyStoreIds) {
        storeList.forEach((item) => {
          if (item.id == id) {
            item.checked = true;
            storeListTmp.push(item);
          }
        });
      }
    }
    return storeListTmp;
  }

  /**待修改项目的默认信息*/
  private buildVDataFromTargetPrd(viewData, productDetail) {
    let viewDataTmp: EditProductInfoViewData = new EditProductInfoViewData();
    AppUtils.copy(viewDataTmp, viewData);
    parseInt(productDetail.state) === ProductStateEnum.Open ? viewDataTmp.state = true : viewDataTmp.state = false;

    viewDataTmp.productDetail = productDetail;
    viewDataTmp.defaultNumber = productDetail.number;
    if (productDetail.imgPathList != null) {
      viewDataTmp.imgPathListTmp = productDetail.imgPathList;//临时图片
      viewDataTmp.limitCount -= productDetail.imgPathList.length;
    }

    return viewDataTmp;
  }

  /**
   *编辑项目方法
   *@param chainId:string
   *@param formData:GoodsAddForm
   *@returns Promise<boolean>
   */
  public editProductInfo(formData: UpdateProductInfoData): Promise<boolean> {
    let chainId: string = SessionUtil.getInstance().getChainId();
    return new Promise<boolean>(resolve => {
      this.chainProductMgr.editProduct(chainId, formData).then(
        (success) => {
          resolve(success);
        }
      )
    });
  }

}
