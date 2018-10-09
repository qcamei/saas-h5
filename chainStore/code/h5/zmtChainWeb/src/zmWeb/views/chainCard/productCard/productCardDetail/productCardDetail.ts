import {Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {AppUtils, ZmMap} from "../../../../comModule/AppUtils";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {ChainCardViewDataMgr} from "../../ChainCardViewDataMgr";
import {Constants} from "../../../common/Util/Constants";
import {GoodsType} from "../../../../bsModule/chainGoods/data/GoodsType";
import {Goods} from "../../../../bsModule/chainGoods/data/Goods";
import {ChainCard} from "../../../../bsModule/chainCard/data/ChainCard";
import {GoodsDetailModalComponent} from "../../../zmComp/functionsComp/goodsDetailComp/GoodsDetailModal.Component";
import {PackageDetailModalComponent} from "../../../zmComp/functionsComp/packageDetailComp/PackageDetailModalComponent";
import {AppRouter} from "../../../../comModule/AppRouter";
import {ChainCardSynDataHolder} from "../../../../bsModule/chainCard/chainCardSynDataHolder";
import {PrdCardType} from "../../../../bsModule/chainCard/data/PrdCardType";
import {ProductCardDetailCacheDataHolder} from "../../../../bsModule/chainCard/productCardDetailCacheDataHolder";
import {ChainGoodsSynDataHolder} from "../../../../bsModule/chainGoods/chainGoodsSynDataHolder";
import {ChainPackageProjectSynDataHolder} from "../../../../bsModule/chainPackageProject/chainPackageProjectSynDataHolder";
import {ProductCardItemEnum} from "../../../../bsModule/chainCard/data/ProductCardItemEnum";
import {ProductInfoDetailModalComponent} from "../../../zmComp/functionsComp/productDetailComp/ProductInfoDetailModal.Component";
import {ChainPackageProject} from "../../../../bsModule/chainPackageProject/data/ChainPackageProject";
import {ChainGoods} from "../../../../bsModule/chainGoods/data/ChainGoods";
import {ProductCardDetail} from "../../../../bsModule/chainCard/data/ProductCardDetail";
import {ProductCardItem} from "../../../../bsModule/chainCard/data/ProductCardItem";
import {PackageProject} from "../../../../bsModule/chainPackageProject/data/PackageProject";
import {PackageProjectType} from "../../../../bsModule/chainPackageProject/data/PackageProjectType";
import {GoodsDetailCacheDataHolder} from "../../../../bsModule/chainGoods/goodsDetailCacheSynHolder";
import {PackageProjectDetailCacheDataHolder} from "../../../../bsModule/chainPackageProject/chainPackageProjectDetailCacheSynHolder";
import {ChainProductSynDataHolder} from "../../../../bsModule/chainProduct/chainProductSynDataHolder";
import {ChainProductDetailCacheSynHolder} from "../../../../bsModule/chainProduct/chainProductDetailCacheSynHolder";
import {ChainProduct} from "../../../../bsModule/chainProduct/data/ChainProduct";
import {Product} from "../../../../bsModule/chainProduct/data/Product";
import {ProductType} from "../../../../bsModule/chainProduct/data/ProductType";
import {Store} from "../../../../bsModule/store/data/Store";
import {StoreMgr} from "../../../../bsModule/store/storeMgr";
import {ZmModalMgr} from "../../../zmComp/modal/ZmModalMgr";
import {MatDialog} from "@angular/material";

@Component({
  selector: 'page-storeCard-productCardDetail',
  templateUrl: 'productCardDetail.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProductCardDetailPage implements OnInit,OnDestroy {
  private viewDataSub: any;
  private paramsSub: any;
  private service: ProductCardDetailService;
  public viewData: ProductCardDetailViewData;

  constructor(private chainCardViewDataMgr: ChainCardViewDataMgr,
              private productCardDetailCacheDataHolder: ProductCardDetailCacheDataHolder,
              private chainProductDetailCacheSynHolder: ChainProductDetailCacheSynHolder,
              private goodsDetailCacheDataHolder: GoodsDetailCacheDataHolder,
              private packageProjectDetailCacheDataHolder: PackageProjectDetailCacheDataHolder,
              private chainProductSynDataHolder: ChainProductSynDataHolder,
              private ChainGoodsSynDataHolder: ChainGoodsSynDataHolder,
              private chainPackageProjectSynDataHolder: ChainPackageProjectSynDataHolder,
              private chainCardSynDataHolder: ChainCardSynDataHolder,
              private storeMgr: StoreMgr,
              private cdRef: ChangeDetectorRef,
              public route: ActivatedRoute,
              private matDialog: MatDialog) {
    ZmModalMgr.getInstance().reset(matDialog);

    this.service = new ProductCardDetailService(
      this.chainCardViewDataMgr,
      this.productCardDetailCacheDataHolder,
      this.chainProductSynDataHolder,
      this.ChainGoodsSynDataHolder,
      this.chainPackageProjectSynDataHolder,
      this.chainCardSynDataHolder,
      this.storeMgr,
    )
    ;
  }

  ngOnInit() {
    this.viewDataSub = this.chainCardViewDataMgr.subscribeProductCardDetailVD((viewDataP: ProductCardDetailViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.paramsSub = this.route.params.subscribe(params => {
      let prdCardId = params['prdCardId'];
      this.service.initViewData(prdCardId);
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

  goEditPage(cardId) {
    AppRouter.goEditProductCard(cardId);
  }

  /**
   * 查询选中产品详情
   * @param item
   */
  public async showDetail(item: ProductCardContentData) {
    if (item.itemType == ProductCardItemEnum.PRODUCT) {
      await this.openProductInfoDetail(item);
    } else if (item.itemType == ProductCardItemEnum.GOODS) {
      await this.openGoodsDetail(item);
    } else if (item.itemType == ProductCardItemEnum.PACKAGE) {
      await this.openPackageDetail(item);
    }

  }

  private async openProductInfoDetail(item: ProductCardContentData) {
    const activeModal = ZmModalMgr.getInstance().newModal(ProductInfoDetailModalComponent,null,null);
    let productDetail = await this.chainProductDetailCacheSynHolder.getData(item.id);
    activeModal.componentInstance.productDetail = productDetail;
    activeModal.componentInstance.productTypeMap = this.viewData.productTypeMap;
  }

  private async openGoodsDetail(item: ProductCardContentData) {
    const activeModal = ZmModalMgr.getInstance().newModal(GoodsDetailModalComponent,null,null);

    let goodsDetail = await this.goodsDetailCacheDataHolder.getData(item.id);
    activeModal.componentInstance.goodsDetail = goodsDetail;
    activeModal.componentInstance.goodsTypeMap = this.viewData.goodsTypeMap;
  }

  private async openPackageDetail(item: ProductCardContentData) {
    const activeModal = ZmModalMgr.getInstance().newModal(PackageDetailModalComponent,null,null);

    let packageDetail = await this.packageProjectDetailCacheDataHolder.getData(item.id);
    activeModal.componentInstance.packageDetail = packageDetail;
    activeModal.componentInstance.packageTypeMap = this.viewData.packageTypeMap;
  }
}

class ProductCardDetailService {

  constructor(private chainCardViewDataMgr: ChainCardViewDataMgr,
              private productCardDetailCacheDataHolder: ProductCardDetailCacheDataHolder,
              private chainProductSynDataHolder: ChainProductSynDataHolder,
              private ChainGoodsSynDataHolder: ChainGoodsSynDataHolder,
              private chainPackageProjectSynDataHolder: ChainPackageProjectSynDataHolder,
              private chainCardSynDataHolder: ChainCardSynDataHolder,
              private storeMgr: StoreMgr,) {
  }

  public initViewData(prdCardId: string): void {
    this.chainCardViewDataMgr.setProductCardDetailViewData(new ProductCardDetailViewData());

    this.buildViewData(prdCardId).then((viewDataTmp: ProductCardDetailViewData) => {
      this.handleViewData(viewDataTmp);
    }).catch(error => {
      AppUtils.handleError(error);
    });

  }

  public handleViewData(viewDataP: ProductCardDetailViewData) {
    this.chainCardViewDataMgr.setProductCardDetailViewData(viewDataP);
  }


  /**
   * 组装viewData
   * @param chainId:string
   * @param prdCardId:string
   * @returns Promise<ProductCardDetailViewData>
   */
  public async buildViewData(prdCardId: string): Promise<ProductCardDetailViewData> {

    let chainId = SessionUtil.getInstance().getChainId();
    let viewDataTmp: ProductCardDetailViewData = new ProductCardDetailViewData();

    let chainProduct: ChainProduct = await this.chainProductSynDataHolder.getData(chainId);
    let chainGoods: ChainGoods = await this.ChainGoodsSynDataHolder.getData(chainId);
    let chainPackageProject: ChainPackageProject = await this.chainPackageProjectSynDataHolder.getData(chainId);
    let chainCard: ChainCard = await this.chainCardSynDataHolder.getData(chainId);
    if (chainCard) {
      viewDataTmp.productCardTypeMap = chainCard.getAllProductCardTypeMap();
    }
    if (chainProduct) {
      viewDataTmp.productTypeMap = chainProduct.getAllProductTypeMap();
      viewDataTmp.productInfoMap = chainProduct.getAllProductMap();
    }
    if (chainGoods) {
      viewDataTmp.goodsTypeMap = chainGoods.getAllGoodsTypeMap();
      viewDataTmp.goodsMap = chainGoods.getAllGoodsMap();
    }
    if (chainPackageProject) {
      viewDataTmp.packageTypeMap = chainPackageProject.getAllPackageTypeMap();
      viewDataTmp.packageProjectMap = chainPackageProject.getAllPackageProjectMap();
    }

    let target: ProductCardDetail = await this.productCardDetailCacheDataHolder.getData(prdCardId);
    if (!AppUtils.isNullObj(target)) {
      viewDataTmp.productCardDetail = target;
      viewDataTmp.productCardContentList = this.buildProductCardContentList(target, viewDataTmp);
      viewDataTmp.applyStoreName = await this.getApplyStoreNames(viewDataTmp.productCardDetail.applyStoreIds);
    }

    return new Promise<ProductCardDetailViewData>(resolve => {
      resolve(viewDataTmp);
    });
  }


  private async getApplyStoreNames(applyStoreIds:Array<string>){
    let chainId = SessionUtil.getInstance().getChainId();
    let pageResp = await this.storeMgr.findStoreByCond(chainId);
    let storeList: Array<Store> = new Array<Store>();
    if (pageResp) {
      storeList = pageResp.list;
    }
    let storeListTmp = new Array<Store>();
    if (applyStoreIds) {
      for (let id of applyStoreIds) {
        storeList.forEach((item) => {
          if (item.id == id) {
            storeListTmp.push(item);
          }
        });
      }
    }
    let arr = new Array<string>();
    arr = storeListTmp.map((item) => {
      return item.name;
    });
    return arr.join("、");
  }

  private buildProductCardContentList(target: ProductCardDetail, viewDataTmp: ProductCardDetailViewData) {
    let packageContentList: Array<ProductCardContentData> = new Array<ProductCardContentData>();
    let productCardItems: Array<ProductCardItem> = new Array<ProductCardItem>();

    if (target.productCardItems == null) {
      return;
    }
    for (let item of target.productCardItems) {
      let productCardItem = new ProductCardItem();
      AppUtils.copy(productCardItem, item);
      productCardItems.push(productCardItem);
    }
    if (productCardItems) {
      for (let item of productCardItems) {
        let productCardContentData = new ProductCardContentData();
        productCardContentData.id = item.pgId;
        productCardContentData.count = item.count;
        productCardContentData.discountPrice = item.discountPrice;
        productCardContentData.itemType = item.itemType;
        if (parseInt(item.itemType.toString()) == ProductCardItemEnum.PRODUCT) {
          if (viewDataTmp.productInfoMap) {
            let product: Product = viewDataTmp.productInfoMap.get(item.pgId.toString());
            if (product) {
              productCardContentData.name = product.name;
              productCardContentData.number = product.number;
              productCardContentData.price = product.sellPrice;
            }
          }
        } else if (parseInt(item.itemType.toString()) == ProductCardItemEnum.GOODS) {
          if (viewDataTmp.goodsMap) {
            let goods: Goods = viewDataTmp.goodsMap.get(item.pgId.toString());
            if (goods) {
              productCardContentData.name = goods.name;
              productCardContentData.number = goods.number;
              productCardContentData.price = goods.sellPrice;
            }
          }
        } else if (parseInt(item.itemType.toString()) == ProductCardItemEnum.PACKAGE) {
          if (viewDataTmp.packageProjectMap) {
            let packageProject: PackageProject = viewDataTmp.packageProjectMap.get(item.pgId);
            if (packageProject) {
              productCardContentData.name = packageProject.name;
              productCardContentData.number = packageProject.number;
              productCardContentData.price = packageProject.sellPrice;
            }
          }
        }
        packageContentList.push(productCardContentData);
      }
    }
    return packageContentList;
  }

}


export class ProductCardDetailViewData {
  chainCard: ChainCard = new ChainCard();
  productCardDetail: ProductCardDetail = new ProductCardDetail();
  productCardContentList: Array<ProductCardContentData> = new Array<ProductCardContentData>();
  productCardTypeMap: ZmMap<PrdCardType>;

  productInfoMap: ZmMap<Product>;
  productTypeMap: ZmMap<ProductType>;

  goodsTypeMap: ZmMap<GoodsType>;
  goodsMap: ZmMap<Goods>;

  packageTypeMap: ZmMap<PackageProjectType>;
  packageProjectMap: ZmMap<PackageProject>;

  applyStoreName:string;
  defaultImg: string = Constants.PRDCARD_DEFAULT_IMG;

}

export class ProductCardContentData {
  id: string;
  itemType: number;
  name: string;
  number: string;
  price: number;
  count: number;
  discountPrice: number;
}
