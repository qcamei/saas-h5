import {Component, ChangeDetectorRef} from '@angular/core';
import {IonicPage, NavParams} from "ionic-angular";
import {ProductCardDetailViewDataMgr} from "./productCardDetailViewDataMgr";
import {StoreCardInfoSynDataHolder} from "../../../bsModule/storeCardInfo/StoreCardInfoSynDataHolder";
import {StoreProductInfoSynDataHolder} from "../../../bsModule/StoreProductInfo/StoreProductInfoSynDataHolder";
import {StorePackageProjectSynDataHolder} from "../../../bsModule/storePackageProject/StorePackageProjectSynDataHolder";
import {StoreGoodsSynDataHolder} from "../../../bsModule/storeGoods/StoreGoodsSynDataHolder";
import {LeaguerDetail} from "../../../bsModule/leaguerDetail/data/LeaguerDetail";
import {ZmMap, AppUtils} from "../../../comModule/AppUtils";
import {ProductCard} from "../../../bsModule/storeCardInfo/data/ProductCard";
import {ProductInfo} from "../../../bsModule/StoreProductInfo/data/ProductInfo";
import {StoreCardInfo} from "../../../bsModule/storeCardInfo/data/StoreCardInfo";
import {StoreProductInfo} from "../../../bsModule/StoreProductInfo/data/StoreProductInfo";
import {StoreGoods} from "../../../bsModule/storeGoods/data/StoreGoods";
import {StorePackageProject} from "../../../bsModule/storePackageProject/data/StorePackageProject";
import {Goods} from "../../../bsModule/storeGoods/data/Goods";
import {PackageProject} from "../../../bsModule/storePackageProject/data/PackageProject";
import {AppRouter} from "../../zmComUtils/AppRouter";
import {ProductCardDetail} from "../../../bsModule/productCardDetail/data/ProductCardDetail";
import {LeaguerProductCard} from "../../../bsModule/storeLeaguerInfo/data/LeaguerProductCard";
import {LeaguerDetailMgr} from "../../../bsModule/leaguerDetail/LeaguerDetailMgr";
import {ProductCardDetailMgr} from "../../../bsModule/productCardDetail/productCardDetailMgr";
import {ProductCardItemEnum} from "../../../bsModule/productCardDetail/data/ProductCardItemEnum";
import {SessionUtil} from "../../../comModule/session/SessionUtil";

@IonicPage({
  name: "productCardDetail",
  segment: 'productCardDetail'
})

@Component({
  template: `
    <zm-page-header title="次卡详情"></zm-page-header>
    <zm-page-content>
      <zm-prd-card-info *ngIf="viewData.productCardDetail!=null" [title]=" '次卡详情' " [prdCard]="viewData.productCardDetail"></zm-prd-card-info>
    </zm-page-content>
  `
})
export class ProductCardDetailPage {

  private service: ProductCardDetailService;
  private viewDataSub: any;
  public viewData: ProductCardDetailViewData = new ProductCardDetailViewData;

  constructor(private cdRef: ChangeDetectorRef,
              private navParams: NavParams,) {

    this.service = new ProductCardDetailService();

    let initData = new ProductCardDetailViewData();
    this.viewDataSub = ProductCardDetailViewDataMgr.getInstance().onDataChanged(initData, (viewDataP: ProductCardDetailViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });

  }

  ionViewDidEnter() {
    this.initData();
  }

  private initData() {
    let targetId = AppRouter.getInstance().getTargetId(this.navParams);
    this.service.initViewData(targetId);
  }

}

export class ProductCardDetailService {

  constructor() {}

  public initViewData(targetId: string) {
    let viewDataTmp = new ProductCardDetailViewData();
    ProductCardDetailViewDataMgr.getInstance().setData(viewDataTmp);

    this.buildViewData(targetId, (viewData: ProductCardDetailViewData) => {
      this.handleViewData(viewData);
    });
  }

  /**
   * 处理回调
   * @param viewDataP
   */
  public handleViewData(viewDataP: ProductCardDetailViewData) {
    ProductCardDetailViewDataMgr.getInstance().setData(viewDataP);
  }

  public async buildViewData(leaguerPrdCardId: string, callback: (viewDataP: ProductCardDetailViewData) => void) {
    let viewDataTmp = new ProductCardDetailViewData();
    let cuserId = SessionUtil.getInstance().getLoginCUserId();
    let storeId = SessionUtil.getInstance().getCurStoreId();

    let storeCardInfo: StoreCardInfo = await StoreCardInfoSynDataHolder.getInstance().getData(storeId);
    if (!AppUtils.isNullObj(storeCardInfo)) {
      viewDataTmp.productCardMap = storeCardInfo.getAllProductCardMap();
    }
    let storeProductInfo: StoreProductInfo = await StoreProductInfoSynDataHolder.getInstance().getData(storeId);
    if (!AppUtils.isNullObj(storeProductInfo)) {
      viewDataTmp.productMap = storeProductInfo.getAllProductInfoMap();
    }
    let storeGoods: StoreGoods = await StoreGoodsSynDataHolder.getInstance().getData(storeId);
    if (!AppUtils.isNullObj(storeGoods)) {
      viewDataTmp.goodsMap = storeGoods.getAllGoodsMap();
    }
    let storePackageProject: StorePackageProject = await StorePackageProjectSynDataHolder.getInstance().getData(storeId);
    if (!AppUtils.isNullObj(storePackageProject)) {
      viewDataTmp.packageProjectMap = storePackageProject.getAllPackageProjectMap();
    }

    let leaguerId = AppUtils.format("{0}_{1}",storeId,cuserId);
    let leaguerDetail: LeaguerDetail = await LeaguerDetailMgr.getInstance().get(storeId,leaguerId);
    if (!AppUtils.isNullObj(leaguerDetail)) {
      viewDataTmp.leaguer = leaguerDetail;
    }

    let productCardDetail: ProductCardDetailVD = new ProductCardDetailVD();
    let productCardId = "";
    if (viewDataTmp.leaguer) {
      let leaguerProductCardMap = viewDataTmp.leaguer.getLeaguerProductCardMap();
      let leaguerProductCard: LeaguerProductCard = leaguerProductCardMap.get(leaguerPrdCardId);
      productCardId = leaguerProductCard.cardId;
      productCardDetail = this.buildProductCardDetail(leaguerProductCard, viewDataTmp.productMap, viewDataTmp.goodsMap, viewDataTmp.packageProjectMap);
    }
    if (productCardId) {
      let productCardDetailTmp: ProductCardDetail = await ProductCardDetailMgr.getInstance().get(storeId, productCardId);
      if (productCardDetailTmp) {
        productCardDetail.cardName = productCardDetailTmp.name;
        productCardDetail.cardNumber = productCardDetailTmp.number;
        productCardDetail.imgPath = productCardDetailTmp.imgPath;
      }
    }

    viewDataTmp.productCardDetail = productCardDetail;

    callback(viewDataTmp);
  }


  private buildProductCardDetail(leaguerProductCard: LeaguerProductCard, productMap: ZmMap<ProductInfo>, goodsMap: ZmMap<Goods>, packageProjectMap: ZmMap<PackageProject>) {

    let target: ProductCardDetailVD = new ProductCardDetailVD();
    target.id = leaguerProductCard.id;
    target.cardId = leaguerProductCard.cardId;
    target.purchaseTime = leaguerProductCard.purchaseTime;
    target.endTime = leaguerProductCard.endTime;
    target.state = leaguerProductCard.state;

    if (leaguerProductCard.leaguerPrdCardItems) {
      for (let item of leaguerProductCard.leaguerPrdCardItems) {//item=>LeaguerPrdCardItem
        if (item.itemType == ProductCardItemEnum.PRODUCT) {
          let productCardItemData = new ProductCardItemData();
          productCardItemData.itemType = ProductCardItemEnum.PRODUCT;
          productCardItemData.pgId = item.pgId;
          productCardItemData.count = item.count;
          productCardItemData.restCount = item.restCount;
          let prodcutInfo: ProductInfo = productMap.get(item.pgId);
          if (prodcutInfo) {
            productCardItemData.pgName = prodcutInfo.name;
          }
          target.prdCardItems.push(productCardItemData);
        } else if (item.itemType == ProductCardItemEnum.GOODS) {
          let productCardItemData = new ProductCardItemData();
          productCardItemData.itemType = ProductCardItemEnum.PRODUCT;
          productCardItemData.pgId = item.pgId;
          productCardItemData.count = item.count;
          productCardItemData.restCount = item.restCount;
          let goods: Goods = goodsMap.get(item.pgId);
          if (goods) {
            productCardItemData.pgName = goods.name;
          }
          target.prdCardItems.push(productCardItemData);

        } else if (item.itemType == ProductCardItemEnum.PACKAGE) {
          let productCardItemData = new ProductCardItemData();
          productCardItemData.itemType = ProductCardItemEnum.PRODUCT;
          productCardItemData.pgId = item.pgId;
          productCardItemData.count = item.count;
          productCardItemData.restCount = item.restCount;
          let packageProject: PackageProject = packageProjectMap.get(item.pgId);
          if (packageProject) {
            productCardItemData.pgName = packageProject.name;
          }
          target.prdCardItems.push(productCardItemData);
        }
      }
    }
    return target;
  }


}

export class ProductCardDetailViewData {

  public leaguer: LeaguerDetail = new LeaguerDetail();//当前会员

  public productCardMap: ZmMap<ProductCard> = new ZmMap<ProductCard>();//次卡map
  public productMap: ZmMap<ProductInfo> = new ZmMap<ProductInfo>();
  public goodsMap: ZmMap<Goods> = new ZmMap<Goods>();
  public packageProjectMap: ZmMap<PackageProject> = new ZmMap<PackageProject>();

  public productCardDetail: ProductCardDetailVD = new ProductCardDetailVD();

}
export class ProductCardDetailVD {//LeaguerProductCard
  id: string;

  cardId: string;
  cardName: string;
  cardNumber: string;
  imgPath: string;

  purchaseTime: number;
  endTime: number;
  state: number;//LeaguerCardEnum

  prdCardItems: Array<ProductCardItemData> = new Array<ProductCardItemData>();


  public static fromProductCardDetail(target, productCardDetail: ProductCardDetail) {
    target.cardName = productCardDetail.name;
    return target;
  }


}

class ProductCardItemData {
  itemType: number;//ProductCardItemEnum
  pgId: string;//-1为不限项目
  pgName: string;
  count: number;//次卡初始数量 -1为无限次
  restCount: number;// 剩余次数 -1为无限次
}





