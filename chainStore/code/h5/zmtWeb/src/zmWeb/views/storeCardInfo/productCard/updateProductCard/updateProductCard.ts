import {Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {AppUtils, ZmMap} from "../../../../comModule/AppUtils";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {StoreCardInfoMgr} from "../../../../bsModule/storeCardInfo/StoreCardInfoMgr";
import {StoreCardInfoViewDataMgr} from "../../StoreCardInfoViewDataMgr";
import {StoreCardInfoUpdateApiForm} from "../../../../bsModule/storeCardInfo/apiData/StoreCardInfoUpdateApiForm";
import {StoreCardInfoUpdateType} from "../../../../bsModule/storeCardInfo/apiData/StoreCardInfoUpdateType";
import {StoreCardInfo} from "../../../../bsModule/storeCardInfo/data/StoreCardInfo";
import {UpdProductCardForm} from "../../../../bsModule/storeCardInfo/apiData/UpdProductCardForm";

import {ChooseCardModal} from "../../Comp/ChooseImgComp/ChooseCardModal.Component";
import {AppRouter} from "../../../../comModule/AppRouter";
import {StoreCardInfoSynDataHolder} from "../../../../bsModule/storeCardInfo/StoreCardInfoSynDataHolder";
import {PromptMsg} from "../../../common/Util/PromptMsg";
import {Constants} from "../../../common/Util/Constants";
import {StoreProductInfoSynDataHolder} from "../../../../bsModule/StoreProductInfo/StoreProductInfoSynDataHolder";
import {ProductInfo} from "../../../../bsModule/StoreProductInfo/data/ProductInfo";
import {ProductCardDetailCacheDataHolder} from "../../../../bsModule/productCardDetail/productCardDetailCacheDataHolder";
import {ProductCardDetail} from "../../../../bsModule/productCardDetail/data/ProductCardDetail";
import {Goods} from "../../../../bsModule/storeGoods/data/Goods";
import {PackageProject} from "../../../../bsModule/storePackageProject/data/PackageProject";
import {ProductCardItem} from "../../../../bsModule/productCardDetail/data/ProductCardItem";
import {ProductData} from "../../Comp/productCardContentComp/ProductCardContentCompViewData";
import {PriceData} from "../../../storePackageProject/packageProject/addPackage/addPackage";
import {StoreProductInfo} from "../../../../bsModule/StoreProductInfo/data/StoreProductInfo";
import {StoreGoods} from "../../../../bsModule/storeGoods/data/StoreGoods";
import {StoreGoodsSynDataHolder} from "../../../../bsModule/storeGoods/StoreGoodsSynDataHolder";
import {StorePackageProject} from "../../../../bsModule/storePackageProject/data/StorePackageProject";
import {StorePackageProjectSynDataHolder} from "../../../../bsModule/storePackageProject/StorePackageProjectSynDataHolder";
import {ProductCardItemEnum} from "../../../../bsModule/productCardDetail/data/ProductCardItemEnum";
import {CardStatusEnum} from "../../../../bsModule/storeCardInfo/data/CardStatusEnum";
import {UseTypeEnum} from "../../../storePackageProject/pipe/UseTypeEnum";
import {PrdCardType} from "../../../../bsModule/storeCardInfo/data/PrdCardType";
import {AddProductCardTypeModal} from "../productCardType/addProductCardTypeCompl";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../../zmComp/modal/ZmModalMgr";
import {PromotionFlagEnum} from "../../../../comModule/enum/PromotionFlagEnum";

@Component({
  selector: 'page-storeCard-updateProductCard',
  templateUrl: 'updateProductCard.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class UpdateProductCardPage implements OnInit,OnDestroy {
  private viewDataSub: any;
  private paramsSub: any;
  private service: UpdateProductCardService;
  public viewData: UpdateProductCardViewData;
  public state: number;


  constructor(private storeCardInfoMgr: StoreCardInfoMgr,
              private storeCardInfoSynDataHolder: StoreCardInfoSynDataHolder,
              private storeCardInfoViewDataMgr: StoreCardInfoViewDataMgr,
              private productCardDetailCacheDataHolder: ProductCardDetailCacheDataHolder,
              private storeProductInfoSynDataHolder: StoreProductInfoSynDataHolder,
              private storeGoodsSynDataHolder: StoreGoodsSynDataHolder,
              private storePackageProjectSynDataHolder: StorePackageProjectSynDataHolder,
              private cdRef: ChangeDetectorRef,
              private matDialog: MatDialog,
              public route: ActivatedRoute) {
    ZmModalMgr.getInstance().reset(matDialog);
    this.service = new UpdateProductCardService(
      this.storeCardInfoMgr,
      this.storeCardInfoSynDataHolder,
      this.storeCardInfoViewDataMgr,
      this.productCardDetailCacheDataHolder,
      this.storeProductInfoSynDataHolder,
      this.storeGoodsSynDataHolder,
      this.storePackageProjectSynDataHolder);
  }

  ngOnInit() {
    this.viewDataSub = this.storeCardInfoViewDataMgr.subscribeUpdateProductCardVD((viewDataP: UpdateProductCardViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.paramsSub = this.route.params.subscribe(params => {
      let productCardId = params['prdCardId'];
      this.service.initViewData(productCardId);
    });

  }

  ngOnDestroy() {
    if (!AppUtils.isNullObj(this.viewDataSub)) {
      this.viewDataSub.unsubscribe();
    }
    if (!AppUtils.isNullObj(this.viewDataSub)) {
      this.paramsSub.unsubscribe();
    }

  }

  hasUnlimitCallback(hasUnLimit: boolean) {
    this.viewData.pageData.hasUnLimit = hasUnLimit;
  }


  /**
   * 选择图片模态框
   */
  showPrdCardModal() {
    const imageActiveModal = ZmModalMgr.getInstance().newModal(ChooseCardModal);
    for (var i = 1; i < 6; i++) {
      let imageStr = `img/logo/card/pic_consumption_card${i}.png`;
      imageActiveModal.componentInstance.imageList.push(imageStr);
    }
    imageActiveModal.componentInstance.callBackSub.subscribe(imgUrl => {
      if (imgUrl != null) {
        this.viewData.productCardDetail.imgPath = imgUrl;
      }
      this.cdRef.markForCheck();
    })
  }

  /**
   * 新建次卡分类
   */
  public addType() {
    const activeModal = ZmModalMgr.getInstance().newModal(AddProductCardTypeModal);
    activeModal.componentInstance.modalHeader = '新建分类';
    activeModal.componentInstance.addFunc = this.refreshTypeList.bind(this);
  }

  /**
   * 新建次卡分类 回调刷新分类列表
   */
  private refreshTypeList(addTypeId:string) {
    let storeId = SessionUtil.getInstance().getStoreId();
    this.storeCardInfoMgr.getStoreCardInfo(storeId).then(
      (storeCardInfo) => {
        this.viewData.typeList = storeCardInfo.getValidProductCardTypeMap().values();
        this.viewData.productCardDetail.typeId = addTypeId;
        this.service.handleViewData(this.viewData);
      });
  }

  /**
   * 自动计算 单个平均价格
   */
  autoSetDiscount() {

    if (this.viewData.pageData.hasUnLimit) {
      return;
    }
    if(this.viewData.productCardContentList.length==0) {
      return;
    }

    let priceData = new PriceData();
    priceData.price = this.viewData.productCardDetail.sellPrice;
    this.viewData.productCardContentList.forEach(item => {
      priceData.totalPrice += item.price * item.count;
      priceData.totalPrice = AppUtils.twoDecimal(priceData.totalPrice);
    });
    let rate: number = priceData.price / priceData.totalPrice;

    for (let item of this.viewData.productCardContentList) {
      item.discountPrice = item.price * rate;
      item.discountPrice = AppUtils.twoDecimal(item.discountPrice);
      if (item.discountPrice > item.price) {
        item.discountPrice = item.price;
      }
    }

  }

  /**number唯一性*/
  checkNumber() {
    if (!AppUtils.isNullOrWhiteSpace(this.viewData.pageData.defaultNumber)) {
      let number = this.viewData.productCardDetail.number;
      let numberList: Array<string> = this.viewData.numberList;

      if (this.viewData.pageData.defaultNumber != number) {
        if (AppUtils.arrayContains(numberList, this.viewData.pageData.defaultNumber)) {
          this.viewData.pageData.isExitNumber = true;
        } else {
          this.viewData.pageData.isExitNumber = false;
        }
      }

      if (this.viewData.pageData.defaultNumber.match("^\\s*[\\w-]+\\s*$")) {
        this.viewData.pageData.notRightNumber = false;
      } else {
        this.viewData.pageData.notRightNumber = true;
      }
    }
  }

  /**
   * 编辑项目 点击事件
   * @param prdId:number
   */
  public async updateProductCard() {
    let successForm = this.checkForm();
    if (successForm) {
      let formData: UpdProductCardForm = this.buildFormData();
      let success = await this.service.updateProductCard(formData);
      this.handleResult(success);
    }

  }

  private checkForm() {
    let success = true;

    if (AppUtils.isNullOrWhiteSpace(this.viewData.productCardDetail.name)
      || AppUtils.isNullOrWhiteSpace(this.viewData.pageData.defaultNumber)
      || AppUtils.isNullObj(this.viewData.productCardDetail.typeId)
      || AppUtils.isNullObj(this.viewData.productCardDetail.sellPrice)) {
      AppUtils.showWarn("提示", "请按要求填写必填项");
      success = false;
    }
    if (AppUtils.isNullObj(this.viewData.productCardContentList)) {
      AppUtils.showWarn("提示", "请选择次卡内容");
      return;
    }

    if (this.viewData.productCardDetail.sellPrice > this.viewData.pageData.totalPrice) {
      AppUtils.showWarn("提示", "次卡售价不能大于产品总价");
      return;
    }
    if(this.viewData.productCardDetail.promotionPrice>this.viewData.productCardDetail.sellPrice){
      AppUtils.showWarn("提示","促销价不能大于售价");
      return;
    }

    let isAutoSet = false;
    for (let item of this.viewData.productCardContentList) {
      if (item.discountPrice == 0) {
        isAutoSet = true;
      }
    }
    if (isAutoSet && this.viewData.pageData.hasUnLimit == false) {
      this.autoSetDiscount();
    }

    return success;
  }


  /**组装updateForm*/
  private buildFormData() {
    let formData: UpdProductCardForm = new UpdProductCardForm();
    AppUtils.copy(formData, this.viewData.productCardDetail);
    this.viewData.pageData.state == true ? formData.status = CardStatusEnum.OPEN : formData.status = CardStatusEnum.CLOSE;
    this.viewData.pageData.promotionFlag == true ? formData.promotionFlag = PromotionFlagEnum.Yes : formData.promotionFlag = PromotionFlagEnum.No;
    formData.productCardItems = this.buildProductCardItems();
    return formData;
  }

  private buildProductCardItems() {
    let productCardItems: Array<ProductCardItem> = new Array<ProductCardItem>();
    for (let item of this.viewData.productCardContentList) {
      let productCardItem = new ProductCardItem();
      productCardItem.pgId = item.id.toString();
      productCardItem.itemType = item.type;
      productCardItem.count = item.count;
      productCardItem.discountPrice = item.discountPrice;
      productCardItems.push(productCardItem);
    }
    return productCardItems;
  }

  /**
   * 处理结果
   */
  private handleResult(successP: boolean): void {
    if (successP) {
      AppUtils.showSuccess(PromptMsg.PROMPT, PromptMsg.EDIT_SUCCESS);
      AppRouter.goProductCardList();
    } else {
      AppUtils.showError(PromptMsg.PROMPT, PromptMsg.EDIT_ERROR);
    }
  }

}


class UpdateProductCardService {

  constructor(private storeCardInfoMgr: StoreCardInfoMgr,
              private storeCardInfoSynDataHolder: StoreCardInfoSynDataHolder,
              private storeCardInfoViewDataMgr: StoreCardInfoViewDataMgr,
              private productCardDetailCacheDataHolder: ProductCardDetailCacheDataHolder,
              private storeProductInfoSynDataHolder: StoreProductInfoSynDataHolder,
              private storeGoodsSynDataHolder: StoreGoodsSynDataHolder,
              private storePackageProjectSynDataHolder: StorePackageProjectSynDataHolder) {
  }

  public initViewData(productCardId: string): void {
    this.storeCardInfoViewDataMgr.setUpdateProductCardViewData(new UpdateProductCardViewData());

    this.buildViewData(productCardId).then((viewDataTmp: UpdateProductCardViewData) => {
      this.handleViewData(viewDataTmp);
    }).catch(error => {
      AppUtils.handleError(error);
    });

  }

  public handleViewData(viewDataP: UpdateProductCardViewData) {
    this.storeCardInfoViewDataMgr.setUpdateProductCardViewData(viewDataP);
  }


  /**
   * 组装viewData
   * @param storeId:string
   * @param prdCardId:string
   * @returns Promise<UpdateProductCardViewData>
   */
  public async buildViewData(productCardId: string): Promise<UpdateProductCardViewData> {
    let storeId = SessionUtil.getInstance().getStoreId();
    let viewDataTmp: UpdateProductCardViewData = new UpdateProductCardViewData();

    let storeProductInfo: StoreProductInfo = await this.storeProductInfoSynDataHolder.getData(storeId);
    let storeGoods: StoreGoods = await this.storeGoodsSynDataHolder.getData(storeId);
    let storePackageProject: StorePackageProject = await this.storePackageProjectSynDataHolder.getData(storeId);
    if (storeProductInfo) {
      viewDataTmp.productInfoMap = storeProductInfo.getAllProductInfoMap();
    }
    if (storeGoods) {
      viewDataTmp.goodsMap = storeGoods.getAllGoodsMap();
    }
    if (storePackageProject) {
      viewDataTmp.packageMap = storePackageProject.getAllPackageProjectMap();
    }


    //次卡详情
    viewDataTmp.productCardDetail = await this.productCardDetailCacheDataHolder.getData(productCardId);
    if (viewDataTmp.productCardDetail) {
      viewDataTmp.pageData.defaultNumber = viewDataTmp.productCardDetail.number;
      viewDataTmp.productCardDetail.status == CardStatusEnum.OPEN ? viewDataTmp.pageData.state = true : viewDataTmp.pageData.state = false;
      viewDataTmp.productCardDetail.promotionFlag == PromotionFlagEnum.Yes ? viewDataTmp.pageData.promotionFlag = true : viewDataTmp.pageData.promotionFlag = false;
      viewDataTmp.productCardContentList = this.buildProductCardContentList(viewDataTmp);
      viewDataTmp.productCardContentList.forEach(item => {
        viewDataTmp.pageData.totalPrice += parseInt(item.price.toString()) * item.count;
      });
    }


    let storeCardInfo: StoreCardInfo = await this.storeCardInfoSynDataHolder.getData(storeId);
    viewDataTmp.typeList = storeCardInfo.getValidProductCardTypeMap().values();
    let prdCardList = storeCardInfo.getProductCardList();
    viewDataTmp.numberList = this.bulidPrdCardNumberList(prdCardList);


    return new Promise<UpdateProductCardViewData>(resolve => {
      resolve(viewDataTmp);
    });
  }

  private buildProductCardContentList(viewDataTmp: UpdateProductCardViewData) {
    let productCardContentListTmp: Array<ProductData> = new Array<ProductData>();

    if(viewDataTmp.productCardDetail.productCardItems==null){
      return productCardContentListTmp;
    }
    let productCardItems: Array<ProductCardItem> = new Array<ProductCardItem>();
    productCardItems = AppUtils.cloneArray(viewDataTmp.productCardDetail.productCardItems);
    for (let item of productCardItems) {
      let productData = new ProductData();
      productData.id = item.pgId;
      productData.type = item.itemType;
      productData.count = item.count;
      item.count == 0 ? productData.userType = UseTypeEnum.UNLIMIT_NUMBER : productData.userType = UseTypeEnum.lIMIT_NUMBER;
      productData.discountPrice = item.discountPrice;
      if (item.itemType == ProductCardItemEnum.PRODUCT) {
        if (viewDataTmp.productInfoMap) {
          let productInfo: ProductInfo = viewDataTmp.productInfoMap.get(item.pgId.toString());
          if (productInfo) {
            productData.name = productInfo.name;
            productData.price = productInfo.price;
          }
        }
      } else if (item.itemType == ProductCardItemEnum.GOODS) {
        if (viewDataTmp.goodsMap) {
          let goods: Goods = viewDataTmp.goodsMap.get(item.pgId.toString());
          if (goods) {
            productData.name = goods.name;
            productData.price = goods.price;
          }
        }
      } else if (item.itemType == ProductCardItemEnum.PACKAGE) {
        if (viewDataTmp.packageMap) {
          let packageProject: PackageProject = viewDataTmp.packageMap.get(item.pgId);
          if (packageProject) {
            productData.name = packageProject.name;
            productData.price = packageProject.sellPrice;
          }
        }
      }
      productCardContentListTmp.push(productData);
    }

    return productCardContentListTmp;
  }


  /**
   * 次卡编号列表
   * 新建时保证编号唯一性
   */
  private bulidPrdCardNumberList(prdCardList): Array<string> {
    let prdCardNumberList = new Array<string>();
    for (let prdCard of prdCardList) {
      prdCardNumberList.push(prdCard.number);
    }
    return prdCardNumberList;
  }

  /**
   * 修改次卡
   */
  public updateProductCard(formData: UpdProductCardForm): Promise<boolean> {
    let storeId = SessionUtil.getInstance().getStoreId();
    let updateForm = new StoreCardInfoUpdateApiForm();
    updateForm.updateType = StoreCardInfoUpdateType.UpdProductCard;
    updateForm.updProductCard = formData;//formData
    return new Promise<boolean>(resolve => {
      this.storeCardInfoMgr.updateStoreCardInfo(storeId, updateForm).then(
        function (success) {
          resolve(success);
        }
      );
    });
  }

}


export class UpdateProductCardViewData {

  typeList: Array<PrdCardType> = new Array<PrdCardType>();
  numberList: Array<string> = new Array<string>();//编号list

  pageData: PageData = new PageData();
  productCardDetail: ProductCardDetail = new ProductCardDetail();
  productCardContentList: Array<ProductData> = new Array<ProductData>();

  productInfoMap: ZmMap<ProductInfo>;
  goodsMap: ZmMap<Goods>;
  packageMap: ZmMap<PackageProject>;

}

export class PageData {
  isExitNumber: boolean = false;
  defaultNumber: string;
  defaultNumberPass: boolean;

  notRightNumber: boolean = false;
  state: boolean;
  promotionFlag:boolean;

  defaultImg: string = Constants.PRDCARD_DEFAULT_IMG;

  hasUnLimit: boolean = false;
  totalPrice: number = 0;
}
