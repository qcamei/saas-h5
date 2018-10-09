import {Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, OnDestroy} from "@angular/core";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {AppUtils} from "../../../../comModule/AppUtils";
import {ActivatedRoute, Router} from "@angular/router";
import {AppCfg} from "../../../../comModule/AppCfg";
import {Constants} from "../../../common/Util/Constants";
import {PromptMsg} from "../../../common/Util/PromptMsg";
import {StoreProductInfoMgr} from "../../../../bsModule/StoreProductInfo/StoreProductInfoMgr";
import {StoreProductInfoSynDataHolder} from "../../../../bsModule/StoreProductInfo/StoreProductInfoSynDataHolder";
import {StoreProductInfoViewDataMgr} from "../../storeProductViewDataMgr";
import {ProductType} from "../../../../bsModule/StoreProductInfo/data/ProductType";
import {AppRouter} from "../../../../comModule/AppRouter";
import {UpdateProductInfoData} from "../../../../bsModule/StoreProductInfo/apiData/UpdateProductInfoData";
import {StoreProductInfo} from "../../../../bsModule/StoreProductInfo/data/StoreProductInfo";
import {
  ProductDetailCacheDataHolder
} from "../../../../bsModule/productDetail/ProductDetailCacheDataHolder";
import {ProductDetail} from "../../../../bsModule/productDetail/data/ProductDetail";
import {ProductInfoState} from "../../../../bsModule/StoreProductInfo/data/ProductInfoState";
import {ZmModalMgr} from "../../../zmComp/modal/ZmModalMgr";
import {AddProductTypeWithReturnComp} from "../comp/addProductTypeWithReturn";
import {MatDialog} from "@angular/material";
import {ProductStateEnum} from "../../../../bsModule/chainProduct/data/ProductStateEnum";
import {PromotionFlagEnum} from "../../../../comModule/enum/PromotionFlagEnum";


@Component({
  selector: 'page-storeProduct-updateProduct',
  templateUrl: 'editProductInfo.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class EditProductInfoPage implements OnInit,OnDestroy {

  private service: EditProductInfoService;
  public viewData: EditProductInfoViewData;
  private viewDataSub: any;
  private paramsSub: any;

  constructor(private storeProductInfoMgr: StoreProductInfoMgr,
              private storeProductInfoSynDataHolder: StoreProductInfoSynDataHolder,
              private storeProductInfoViewDataMgr: StoreProductInfoViewDataMgr,
              private productDetailCacheDataHolder:ProductDetailCacheDataHolder,
              private cdRef: ChangeDetectorRef,
              public route: ActivatedRoute,
              public router: Router,
              private matDialog: MatDialog) {
    ZmModalMgr.getInstance().reset(matDialog);

    this.service = new EditProductInfoService(
      this.storeProductInfoMgr,
      this.storeProductInfoSynDataHolder,
      this.storeProductInfoViewDataMgr,
      this.productDetailCacheDataHolder);
  }

  ngOnInit() {
    this.viewDataSub = this.storeProductInfoViewDataMgr.subscribeEditProductInfoVD((viewDataP: EditProductInfoViewData) => {
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
      if (this.viewData.productDetail.defaultImg == Constants.PRODUCT_DEFAULT_IMG) {
        AppUtils.removeFromArray(this.viewData.productDetail.imgPathList, this.viewData.productDetail.defaultImg);
      }
      this.viewData.productDetail.imgPathList = this.viewData.productDetail.imgPathList.concat(imgArr);
      this.viewData.limitCount = Constants.MAX_UPLOAD_IMG - this.viewData.productDetail.imgPathList.length;
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
        this.viewData.productDetail.typeId = addTypeId;
        this.service.handleViewData(this.viewData);
      });
  }



  /**
   * 编辑项目 点击事件
   * @param productId:number
   */
  public async updateProduct(productId: string) {
    if(this.viewData.productDetail.promotionPrice>this.viewData.productDetail.price){
      AppUtils.showWarn("提示","促销价不能大于售价");
      return;
    }
    let updateProductInfoData = this.buildUpdateProductInfoData(productId);
    let success = await this.service.editProductInfo(updateProductInfoData);
    if (success) {
      AppUtils.showSuccess(PromptMsg.PROMPT, PromptMsg.EDIT_SUCCESS);
      AppRouter.goProductInfoList();
    } else {
      AppUtils.showError(PromptMsg.PROMPT, PromptMsg.EDIT_ERROR);
    }
  }



  /**组装UpdateProductInfoData*/
  private buildUpdateProductInfoData(productId: string) {
    let updateProductInfoData: UpdateProductInfoData = new UpdateProductInfoData();
    updateProductInfoData.id = productId;
    updateProductInfoData.storeId = SessionUtil.getInstance().getStoreId();
    updateProductInfoData.imgPathList = this.viewData.productDetail.imgPathList;
    updateProductInfoData.defaultImg = this.viewData.productDetail.imgPathList[0];
    updateProductInfoData.number = this.viewData.defaultNumber;
    updateProductInfoData.name = AppUtils.trimBlank(this.viewData.productDetail.name);
    updateProductInfoData.cost = this.viewData.productDetail.cost;
    updateProductInfoData.price = this.viewData.productDetail.price;
    updateProductInfoData.typeId = this.viewData.productDetail.typeId;
    updateProductInfoData.descript = this.viewData.productDetail.descript;
    updateProductInfoData.promotionPrice = this.viewData.productDetail.promotionPrice;
    this.viewData.promotionFlag === true ? updateProductInfoData.promotionFlag = PromotionFlagEnum.Yes : updateProductInfoData.promotionFlag = PromotionFlagEnum.No;
    this.viewData.state === true ? updateProductInfoData.state = ProductInfoState.OPEN : updateProductInfoData.state = ProductInfoState.CLOSE;
    return updateProductInfoData;
  }
}

class EditProductInfoService {

  constructor(private storeProductInfoMgr: StoreProductInfoMgr,
              private storeProductInfoSynDataHolder: StoreProductInfoSynDataHolder,
              private storeProductInfoViewDataMgr: StoreProductInfoViewDataMgr,
              private productDetailCacheDataHolder:ProductDetailCacheDataHolder,) {
  }

  public initViewData(productDetailId: number): void {

    this.storeProductInfoViewDataMgr.setEditProductInfoViewData(new EditProductInfoViewData());

    this.buildViewData(productDetailId).then((viewDataTmp: EditProductInfoViewData) => {

      this.handleViewData(viewDataTmp);
    }).catch(error => {
      AppUtils.handleError(error);
    });
  }

  public handleViewData(viewDataP: EditProductInfoViewData) {
    this.storeProductInfoViewDataMgr.setEditProductInfoViewData(viewDataP);
  }


  public async buildViewData(productDetailId: number): Promise<EditProductInfoViewData> {

    let storeId = SessionUtil.getInstance().getStoreId();
    let viewDataTmp: EditProductInfoViewData = new EditProductInfoViewData();
    let storeProduct: StoreProductInfo = await this.storeProductInfoSynDataHolder.getData(storeId);
    viewDataTmp.typeList = storeProduct.getValidProductTypeList();
    let productInfoList = storeProduct.getAllProductInfoList();
    for (let productInfo of productInfoList) {
      viewDataTmp.productNumberList.push(productInfo.number);
    }
    viewDataTmp.requestUrl = AppCfg.getInstance().getServiceAddress() + "/img/saveImgs/img/product/" + productDetailId;
    let productDetail:ProductDetail = await this.productDetailCacheDataHolder.getData(productDetailId.toString());

    if (productDetail) {
      productDetail.state == ProductStateEnum.Open ? viewDataTmp.state = true : viewDataTmp.state = false;
      productDetail.promotionFlag == PromotionFlagEnum.Yes?viewDataTmp.promotionFlag = true:viewDataTmp.promotionFlag = false;
      viewDataTmp.productDetail = EditViewData.fromProductDetail(productDetail);
      viewDataTmp.defaultNumber = productDetail.number;
      if (productDetail.imgPathList != null) {
        viewDataTmp.limitCount -= productDetail.imgPathList.length;
      }
    }

    return new Promise<EditProductInfoViewData>(resolve => {
      resolve(viewDataTmp);
    });
  }

  /**
   *编辑项目方法
   *@param storeId:string
   *@param formData:GoodsAddForm
   *@returns Promise<boolean>
   */
  public editProductInfo(formData: UpdateProductInfoData): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.storeProductInfoMgr.editProductInfo(formData).then(
        (success) => {
          resolve(success);
        }
      )
    });
  }

}


export class EditProductInfoViewData {
  public productDetail: EditViewData = new EditViewData();

  public productNumberList: Array<string> = new Array<string>();//项目编号list
  public typeList: Array<ProductType> = new Array<ProductType>();

  public promotionFlag:boolean;
  private _state: boolean;//上下架状态
  get state(): boolean {
    return this._state;
  }
  set state(value: boolean) {
    this._state = value;
  }


  public defaultNumber:string;
  public defaultNumberPass:boolean;
  public requestUrl: string;
  public limitCount: number = Constants.MAX_UPLOAD_IMG;
  public maxCount: number = Constants.MAX_UPLOAD_IMG;

}

export class EditViewData {
  constructor(){}
  id: string;
  productId:string;
  storeId: string;
  number: string;
  numberPass:boolean = true;
  name: string;
  namePass:boolean;
  typeId: string;
  state: number;
  descript: string;
  price: number;
  cost: number;
  imgPathList: Array<string> = new Array<string>();
  defaultImg: string = Constants.PRODUCT_DEFAULT_IMG;
  promotionFlag:number;
  promotionPrice: number = 0;

  public static fromProductDetail(productDetail:ProductDetail){
    let target = new EditViewData();
    target.id = productDetail.id;
    target.productId = productDetail.productId;
    target.storeId = productDetail.storeId;
    target.number = productDetail.number;
    target.name = productDetail.name;
    target.typeId = productDetail.typeId;
    target.descript = productDetail.descript;
    target.price = productDetail.price;
    target.cost = productDetail.cost;
    target.state = productDetail.state;
    target.imgPathList = productDetail.imgPathList;
    target.defaultImg = productDetail.imgPathList[0];
    target.promotionFlag = productDetail.promotionFlag;
    target.promotionPrice = productDetail.promotionPrice;
    return target;
  }
}
