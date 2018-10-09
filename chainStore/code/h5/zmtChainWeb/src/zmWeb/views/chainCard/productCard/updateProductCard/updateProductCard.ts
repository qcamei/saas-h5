import {Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {AppUtils, ZmMap} from "../../../../comModule/AppUtils";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {ChainCardMgr} from "../../../../bsModule/chainCard/chainCardMgr";
import {ChainCardViewDataMgr} from "../../ChainCardViewDataMgr";
import {ChainCardUpdateApiForm} from "../../../../bsModule/chainCard/apiData/ChainCardUpdateApiForm";
import {ChainCardUpdateType} from "../../../../bsModule/chainCard/apiData/ChainCardUpdateType";
import {ChainCard} from "../../../../bsModule/chainCard/data/ChainCard";
import {UpdProductCardForm} from "../../../../bsModule/chainCard/apiData/UpdProductCardForm";
import {ChooseCardModal} from "../../Comp/ChooseImgComp/ChooseCardModal.Component";
import {AppRouter} from "../../../../comModule/AppRouter";
import {ChainCardSynDataHolder} from "../../../../bsModule/chainCard/chainCardSynDataHolder";
import {PromptMsg} from "../../../common/Util/PromptMsg";
import {Constants} from "../../../common/Util/Constants";

import {Goods} from "../../../../bsModule/chainGoods/data/Goods";
import {PackageProject} from "../../../../bsModule/chainPackageProject/data/PackageProject";
import {ChainGoods} from "../../../../bsModule/chainGoods/data/ChainGoods";
import {ChainGoodsSynDataHolder} from "../../../../bsModule/chainGoods/chainGoodsSynDataHolder";
import {ChainPackageProject} from "../../../../bsModule/chainPackageProject/data/ChainPackageProject";
import {ChainPackageProjectSynDataHolder} from "../../../../bsModule/chainPackageProject/chainPackageProjectSynDataHolder";
import {CardStatusEnum} from "../../../../bsModule/chainCard/data/CardStatusEnum";
import {PrdCardType} from "../../../../bsModule/chainCard/data/PrdCardType";
import {AddProductCardTypeModal} from "../productCardType/addProductCardTypeCompl";
import {ProductCardDetailCacheDataHolder} from "../../../../bsModule/chainCard/productCardDetailCacheDataHolder";
import {PriceData, StoreVD} from "../../../chainPackageProject/packageProject/addPackage/addPackage";
import {ProductCardItem} from "../../../../bsModule/chainCard/data/ProductCardItem";
import {ProductData} from "../../Comp/productCardContentComp/ProductCardContentCompViewData";
import {UseTypeEnum} from "../../../chainPackageProject/pipe/UseTypeEnum";
import {ProductCardItemEnum} from "../../../../bsModule/chainCard/data/ProductCardItemEnum";
import {ProductCardDetail} from "../../../../bsModule/chainCard/data/ProductCardDetail";
import {ChainProductSynDataHolder} from "../../../../bsModule/chainProduct/chainProductSynDataHolder";
import {ChainProduct} from "../../../../bsModule/chainProduct/data/ChainProduct";
import {Product} from "../../../../bsModule/chainProduct/data/Product";
import {StoreMgr} from "../../../../bsModule/store/storeMgr";
import {StoreListComp} from "../../../productionLibrary/Comp/storeListComp/StoreListComp";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../../zmComp/modal/ZmModalMgr";
import {AddProductCardTypeWithReturnComp} from "../../Comp/addTypeWithReturn/addPrdCardTypeWithReturn";

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


  constructor(private chainCardMgr: ChainCardMgr,
              private chainCardSynDataHolder: ChainCardSynDataHolder,
              private chainCardViewDataMgr: ChainCardViewDataMgr,
              private productCardDetailCacheDataHolder: ProductCardDetailCacheDataHolder,
              private chainProductSynDataHolder: ChainProductSynDataHolder,
              private ChainGoodsSynDataHolder: ChainGoodsSynDataHolder,
              private chainPackageProjectSynDataHolder: ChainPackageProjectSynDataHolder,
              private storeMgr: StoreMgr,
              private cdRef: ChangeDetectorRef,
              public route: ActivatedRoute,
              private matDialog: MatDialog) {
    ZmModalMgr.getInstance().reset(matDialog);

    this.service = new UpdateProductCardService(
      this.chainCardMgr,
      this.chainCardSynDataHolder,
      this.chainCardViewDataMgr,
      this.productCardDetailCacheDataHolder,
      this.chainProductSynDataHolder,
      this.ChainGoodsSynDataHolder,
      this.chainPackageProjectSynDataHolder,
      this.storeMgr);
  }

  ngOnInit() {
    this.viewDataSub = this.chainCardViewDataMgr.subscribeUpdateProductCardVD((viewDataP: UpdateProductCardViewData) => {
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
    let imageArr = new Array<string>();
    for (let i = 1; i < 7; i++) {
      let imageStr = `img/logo/card/pic_consumption_card${i}.png`;
      imageArr.push(imageStr);
    }

    let modalData = {imageList: imageArr};
    let tmp = this;
    let callBack = (imgUrl) => {
      if (imgUrl != null) {
        tmp.viewData.productCardDetail.imgPath = imgUrl;
      }
      tmp.cdRef.markForCheck();
    };
    ZmModalMgr.getInstance().newLgModal(ChooseCardModal, modalData, callBack);
  }

  /**
   * 新建次卡分类
   */
  public addType() {
    let modalData = {modalHeader: '新建分类',};
    let tmp = this;
    let callBack = (addTypeId: string) => {
      tmp.refreshTypeList(addTypeId);//回调刷新列表
    };
    ZmModalMgr.getInstance().newSmallModal(AddProductCardTypeWithReturnComp, modalData, callBack);

  }

  /**
   * 新建次卡分类 回调刷新分类列表
   */
  private refreshTypeList(addTypeId: string) {
    let chainId = SessionUtil.getInstance().getChainId();
    this.chainCardMgr.getChainCard(chainId).then(
      (chainCard) => {
        this.viewData.typeList = chainCard.getValidProductCardTypeMap().values();
        this.viewData.productCardDetail.typeId = Constants.PRODUCTCARD_TYPE_PREFIX + chainId + "_" + addTypeId;
        this.service.handleViewData(this.viewData);
      });
  }

  public selectStore() {
    let modalData = {storeList: this.viewData.storeList};
    let tmp = this;
    let callBack = (storeList: Array<StoreVD>) => {
      tmp.getSelectedStore(storeList);//回调刷新列表
    };
    ZmModalMgr.getInstance().newModal(StoreListComp, modalData, callBack);
  }

  private getSelectedStore(storeList: Array<StoreVD>) {
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
   * 自动计算 单个平均价格
   */
  autoSetDiscount() {

    if (this.viewData.pageData.hasUnLimit) {
      return;
    }
    if (this.viewData.productCardContentList.length == 0) {
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
    formData.productCardItems = this.buildProductCardItems();
    formData.applyStoreIds = this.viewData.selectStoreIds;
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

  constructor(private chainCardMgr: ChainCardMgr,
              private chainCardSynDataHolder: ChainCardSynDataHolder,
              private chainCardViewDataMgr: ChainCardViewDataMgr,
              private productCardDetailCacheDataHolder: ProductCardDetailCacheDataHolder,
              private chainProductSynDataHolder: ChainProductSynDataHolder,
              private ChainGoodsSynDataHolder: ChainGoodsSynDataHolder,
              private chainPackageProjectSynDataHolder: ChainPackageProjectSynDataHolder,
              private storeMgr: StoreMgr,) {
  }

  public initViewData(productCardId: string): void {
    this.chainCardViewDataMgr.setUpdateProductCardViewData(new UpdateProductCardViewData());

    this.buildViewData(productCardId).then((viewDataTmp: UpdateProductCardViewData) => {
      this.handleViewData(viewDataTmp);
    }).catch(error => {
      AppUtils.handleError(error);
    });

  }

  public handleViewData(viewDataP: UpdateProductCardViewData) {
    this.chainCardViewDataMgr.setUpdateProductCardViewData(viewDataP);
  }


  /**
   * 组装viewData
   * @param chainId:string
   * @param prdCardId:string
   * @returns Promise<UpdateProductCardViewData>
   */
  public async buildViewData(productCardId: string): Promise<UpdateProductCardViewData> {
    let chainId = SessionUtil.getInstance().getChainId();
    let viewDataTmp: UpdateProductCardViewData = new UpdateProductCardViewData();

    let chainProduct: ChainProduct = await this.chainProductSynDataHolder.getData(chainId);
    let chainGoods: ChainGoods = await this.ChainGoodsSynDataHolder.getData(chainId);
    let chainPackageProject: ChainPackageProject = await this.chainPackageProjectSynDataHolder.getData(chainId);
    if (chainProduct) {
      viewDataTmp.productInfoMap = chainProduct.getAllProductMap();
    }
    if (chainGoods) {
      viewDataTmp.goodsMap = chainGoods.getAllGoodsMap();
    }
    if (chainPackageProject) {
      viewDataTmp.packageMap = chainPackageProject.getAllPackageProjectMap();
    }

    let pageResp = await this.storeMgr.findStoreByCond(chainId);
    if (pageResp) {
      viewDataTmp.storeList = pageResp.list.map((store) => {
        return StoreVD.fromStore(store);
      });
    }

    //次卡详情
    viewDataTmp.productCardDetail = await this.productCardDetailCacheDataHolder.getData(productCardId);
    if (viewDataTmp.productCardDetail) {
      viewDataTmp.pageData.defaultNumber = viewDataTmp.productCardDetail.number;
      viewDataTmp.productCardDetail.status == CardStatusEnum.OPEN ? viewDataTmp.pageData.state = true : viewDataTmp.pageData.state = false;
      viewDataTmp.productCardContentList = this.buildProductCardContentList(viewDataTmp);
      viewDataTmp.productCardContentList.forEach(item => {
        viewDataTmp.pageData.totalPrice += parseInt(item.price.toString()) * item.count;
      });

      viewDataTmp.selectStoreList = this.getSelectStoreList(viewDataTmp.storeList, viewDataTmp.productCardDetail.applyStoreIds);
      viewDataTmp.selectStoreIds = viewDataTmp.selectStoreList.map((item) => {
        return item.id;
      });
    }

    let chainCard: ChainCard = await this.chainCardSynDataHolder.getData(chainId);
    viewDataTmp.typeList = chainCard.getValidProductCardTypeMap().values();
    let prdCardList = chainCard.getProductCardMap().values();
    viewDataTmp.numberList = this.bulidPrdCardNumberList(prdCardList);

    return new Promise<UpdateProductCardViewData>(resolve => {
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

  private buildProductCardContentList(viewDataTmp: UpdateProductCardViewData) {
    let productCardContentListTmp: Array<ProductData> = new Array<ProductData>();

    if (viewDataTmp.productCardDetail.productCardItems == null) {
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
          let productInfo: Product = viewDataTmp.productInfoMap.get(item.pgId.toString());
          if (productInfo) {
            productData.name = productInfo.name;
            productData.price = productInfo.sellPrice;
          }
        }
      } else if (item.itemType == ProductCardItemEnum.GOODS) {
        if (viewDataTmp.goodsMap) {
          let goods: Goods = viewDataTmp.goodsMap.get(item.pgId.toString());
          if (goods) {
            productData.name = goods.name;
            productData.price = goods.sellPrice;
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
    let chainId = SessionUtil.getInstance().getChainId();
    let updateForm = new ChainCardUpdateApiForm();
    updateForm.updateType = ChainCardUpdateType.UpdProductCard;
    updateForm.updProductCard = formData;//formData
    return new Promise<boolean>(resolve => {
      this.chainCardMgr.updateChainCard(chainId, updateForm).then(
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

  productInfoMap: ZmMap<Product>;
  goodsMap: ZmMap<Goods>;
  packageMap: ZmMap<PackageProject>;


  public storeList: Array<StoreVD> = new Array<StoreVD>();
  public selectStoreList: Array<StoreVD> = new Array<StoreVD>();
  public selectStoreIds: Array<string> = new Array<string>();

}

export class PageData {
  isExitNumber: boolean = false;
  defaultNumber: string;
  defaultNumberPass: boolean;

  notRightNumber: boolean = false;
  state: boolean;

  defaultImg: string = Constants.PRDCARD_DEFAULT_IMG;

  hasUnLimit: boolean = false;
  totalPrice: number = 0;
}
