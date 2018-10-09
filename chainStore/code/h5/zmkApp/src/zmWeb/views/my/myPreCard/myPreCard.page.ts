import {Component, ChangeDetectorRef} from '@angular/core';
import {IonicPage} from "ionic-angular";
import {MyPreCardViewDataMgr} from "./myPreCardViewDataMgr";
import {LeaguerDetail} from "../../../bsModule/leaguerDetail/data/LeaguerDetail";
import {ZmMap, AppUtils} from "../../../comModule/AppUtils";
import {LeaguerDetailMgr} from "../../../bsModule/leaguerDetail/LeaguerDetailMgr";
import {ProductCard} from "../../../bsModule/storeCardInfo/data/ProductCard";
import {AppRouter} from "../../zmComUtils/AppRouter";
import {StoreGoods} from "../../../bsModule/storeGoods/data/StoreGoods";
import {Goods} from "../../../bsModule/storeGoods/data/Goods";
import {StoreGoodsSynDataHolder} from "../../../bsModule/storeGoods/StoreGoodsSynDataHolder";
import {StorePackageProject} from "../../../bsModule/storePackageProject/data/StorePackageProject";
import {StorePackageProjectSynDataHolder} from "../../../bsModule/storePackageProject/StorePackageProjectSynDataHolder";
import {PackageProject} from "../../../bsModule/storePackageProject/data/PackageProject";
import {StoreProductInfo} from "../../../bsModule/StoreProductInfo/data/StoreProductInfo";
import {StoreProductInfoSynDataHolder} from "../../../bsModule/StoreProductInfo/StoreProductInfoSynDataHolder";
import {ProductInfo} from "../../../bsModule/StoreProductInfo/data/ProductInfo";
import {PreStoreCard} from "../../../bsModule/leaguerDetail/data/PreStoreCard";
import {ProductCardItemEnum} from "../../../bsModule/productCardDetail/data/ProductCardItemEnum";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {ProductType} from "../../../bsModule/StoreProductInfo/data/ProductType";
import {GoodsType} from "../../../bsModule/storeGoods/data/GoodsType";
import {PackageProjectType} from "../../../bsModule/storePackageProject/data/PackageProjectType";

@IonicPage({
  name: "myPreCard",
  segment: 'myPreCard'
})

@Component({
  template: `
    <zm-page-header title="我的预存"></zm-page-header>
    <zm-page-content>
    <div style="margin-bottom:53px;">
      <zmk-own-item zmk-item-sm *ngFor="let item of viewData.leaguerPrdCardItemsTmp" [imgSrc]="item.defaultImg|zmImgPath" [name]="item.pgName" [typeName]="item.pgTypeName" [price]="item.sellPrice" [count]="item.count"></zmk-own-item>
      <zm-no-data *ngIf="viewData.loadingFinish && viewData.leaguerPrdCardItemsTmp.length == 0" ></zm-no-data>
    </div>  
    </zm-page-content>
    <ion-footer class="bg-white">
       <zm-page [totalSize]="viewData.totalCount"  [curPage]="viewData.pageNo" (pageChange)="pageChange($event)"></zm-page>
    </ion-footer>
  `
})
export class MyPreCardPage {

  private service: MyPreCardService;
  private viewDataSub: any;
  public viewData: MyPreCardViewData = new MyPreCardViewData;

  constructor(private cdRef: ChangeDetectorRef,) {

    this.service = new MyPreCardService();

    let initData = new MyPreCardViewData();
    this.viewDataSub = MyPreCardViewDataMgr.getInstance().onDataChanged(initData, (viewDataP: MyPreCardViewData) => {
      this.viewData = viewDataP;
      // this.doForAnimate();
      this.cdRef.markForCheck();
    });

  }

  // animateItems = [];
  //
  // doForAnimate() {
  //   let target = this;
  //   for (let i = 0; i < target.viewData.leaguerPrdCardItemsTmp.length; i++) {
  //     setTimeout(function () {
  //       target.animateItems.push(target.viewData.leaguerPrdCardItemsTmp[i]);
  //     }, 200 * i + 500);
  //   }
  // }
  //
  // ionViewWillEnter() {
  //   this.animateItems = [];
  // }

  ionViewDidEnter() {
    this.service.initViewData();
  }

  pageChange(pageNoP:number){
    this.viewData.pageNo = pageNoP;
    this.viewData.leaguerPrdCardItemsTmp = AppUtils.getPageData(pageNoP,this.viewData.leaguerPrdCardItems);
    this.service.handleViewData(this.viewData);
  }

  goPrdCardDetailPage(prdCardId: string) {
    AppRouter.getInstance().goPrdCardDetailPage(prdCardId);
  }

}

export class MyPreCardService {

  constructor() {
  }

  public initViewData() {
    let viewDataTmp = new MyPreCardViewData();
    MyPreCardViewDataMgr.getInstance().setData(viewDataTmp);

    this.buildViewData((viewData: MyPreCardViewData) => {
      this.handleViewData(viewData);
    });
  }

  /**
   * 处理回调
   * @param viewDataP
   */
  public handleViewData(viewDataP: MyPreCardViewData) {
    MyPreCardViewDataMgr.getInstance().setData(viewDataP);
  }

  public async buildViewData(callback: (viewDataP: MyPreCardViewData) => void) {
    let viewDataTmp = new MyPreCardViewData();
    AppUtils.showLoading(viewDataTmp.loadingFinish);

    let cuserId = SessionUtil.getInstance().getLoginCUserId();
    let storeId = SessionUtil.getInstance().getCurStoreId();
    let storeProductInfo: StoreProductInfo = await StoreProductInfoSynDataHolder.getInstance().getData(storeId);
    if (!AppUtils.isNullObj(storeProductInfo)) {
      viewDataTmp.productMap = storeProductInfo.getAllProductInfoMap();
      viewDataTmp.productTypeMap = storeProductInfo.getAllProductTypeMap();
    }
    let storeGoods: StoreGoods = await StoreGoodsSynDataHolder.getInstance().getData(storeId);
    if (!AppUtils.isNullObj(storeGoods)) {
      viewDataTmp.goodsMap = storeGoods.getAllGoodsMap();
      viewDataTmp.goodsTypeMap = storeGoods.getAllGoodsTypeMap();
    }
    let storePackageProject: StorePackageProject = await StorePackageProjectSynDataHolder.getInstance().getData(storeId);
    if (!AppUtils.isNullObj(storePackageProject)) {
      viewDataTmp.packageProjectMap = storePackageProject.getAllPackageProjectMap();
      viewDataTmp.packageProjectTypeMap = storePackageProject.getAllPackageTypeMap();
    }

    let leaguerId = AppUtils.format("{0}_{1}", storeId, cuserId);
    let leaguerDetail: LeaguerDetail = await LeaguerDetailMgr.getInstance().get(storeId, leaguerId);
    if (!AppUtils.isNullObj(leaguerDetail)) {
      viewDataTmp.leaguer = leaguerDetail;
    }
    if (viewDataTmp.leaguer.leaguerPreStoreCardMap) {
      let preProductList = viewDataTmp.leaguer.getPreStoreCardMap().values();
      viewDataTmp.preStoreCardList = this.getPreStoreCardList(preProductList, viewDataTmp);
    }
    viewDataTmp.preStoreCardList.forEach((item) => {
      viewDataTmp.leaguerPrdCardItems = viewDataTmp.leaguerPrdCardItems.concat(item.leaguerPrdCardItems);
    });
    viewDataTmp.totalCount = viewDataTmp.leaguerPrdCardItems.length;
    viewDataTmp.leaguerPrdCardItemsTmp = AppUtils.getPageData(1,viewDataTmp.leaguerPrdCardItems);
    viewDataTmp.loadingFinish = true;
    AppUtils.hideLoading(viewDataTmp.loadingFinish);
    callback(viewDataTmp);
  }

  private getPreStoreCardList(preProductList: Array<PreStoreCard>, viewDataTmp: MyPreCardViewData): Array<PreStoreCardData> {

    let preStoreCardDataList = new Array<PreStoreCardData>();

    for (let preStoreCard of preProductList) {//PreStoreCard
      let preStoreCardData = new PreStoreCardData();
      preStoreCardData.id = preStoreCard.id;
      preStoreCardData.orderId = preStoreCard.orderId;
      for (let leaguerPrdCardItem of preStoreCard.leaguerPrdCardItems) {
        let preStoreCardItem = new PreStoreCardItem();
        preStoreCardItem.itemType = leaguerPrdCardItem.itemType;
        preStoreCardItem.count = leaguerPrdCardItem.restCount;//剩余数量
        preStoreCardItem.restCount = leaguerPrdCardItem.restCount;//剩余数量
        preStoreCardItem.pgId = leaguerPrdCardItem.pgId;
        if (leaguerPrdCardItem.itemType == ProductCardItemEnum.PRODUCT) {//项目
          let productInfo: ProductInfo = viewDataTmp.productMap.get(leaguerPrdCardItem.pgId);
          if (!AppUtils.isNullObj(productInfo)) {
            preStoreCardItem.pgName = productInfo.name;
            preStoreCardItem.sellPrice = productInfo.price;
            preStoreCardItem.defaultImg = productInfo.defaultImg;
            let type: ProductType = viewDataTmp.productTypeMap.get(productInfo.typeId);
            if (type) {
              preStoreCardItem.pgTypeName = type.name;
            }
          }
        } else if (leaguerPrdCardItem.itemType == ProductCardItemEnum.GOODS) {//商品
          let goods: Goods = viewDataTmp.goodsMap.get(leaguerPrdCardItem.pgId);
          if (!AppUtils.isNullObj(goods)) {
            preStoreCardItem.pgName = goods.name;
            preStoreCardItem.sellPrice = goods.price;
            preStoreCardItem.defaultImg = goods.defaultImg;
            let type: GoodsType = viewDataTmp.goodsTypeMap.get(goods.typeId);
            if (type) {
              preStoreCardItem.pgTypeName = type.name;
            }
          }
        } else if (leaguerPrdCardItem.itemType == ProductCardItemEnum.PACKAGE) {//套餐
          let packageProject: PackageProject = viewDataTmp.packageProjectMap.get(leaguerPrdCardItem.pgId);
          if (!AppUtils.isNullObj(packageProject)) {
            preStoreCardItem.pgName = packageProject.name;
            preStoreCardItem.sellPrice = packageProject.sellPrice;
            preStoreCardItem.defaultImg = packageProject.defaultImg;
            let type: PackageProjectType = viewDataTmp.packageProjectTypeMap.get(packageProject.typeId);
            if (type) {
              preStoreCardItem.pgTypeName = type.name;
            }
          }
        }
        //隐藏已划完的预存
        if (preStoreCardItem.count == -1 || preStoreCardItem.restCount > 0) {
          preStoreCardData.leaguerPrdCardItems.push(preStoreCardItem);
        }
      }
      preStoreCardDataList.push(preStoreCardData);
    }
    return preStoreCardDataList;
  }
}

export class MyPreCardViewData {

  public leaguer: LeaguerDetail = new LeaguerDetail();//当前会员

  public productCardMap: ZmMap<ProductCard> = new ZmMap<ProductCard>();//次卡map

  public productMap: ZmMap<ProductInfo> = new ZmMap<ProductInfo>();
  public goodsMap: ZmMap<Goods> = new ZmMap<Goods>();
  public packageProjectMap: ZmMap<PackageProject> = new ZmMap<PackageProject>();
  public productTypeMap: ZmMap<ProductType> = new ZmMap<ProductType>();
  public goodsTypeMap: ZmMap<GoodsType> = new ZmMap<GoodsType>();
  public packageProjectTypeMap: ZmMap<PackageProjectType> = new ZmMap<PackageProjectType>();

  public preStoreCardList: Array<PreStoreCardData> = new Array<PreStoreCardData>();
  public leaguerPrdCardItems: Array<PreStoreCardItem> = new Array<PreStoreCardItem>();
  public leaguerPrdCardItemsTmp: Array<PreStoreCardItem> = new Array<PreStoreCardItem>();
  public totalCount: number = 0;
  public pageNo: number = 1;
  public loadingFinish: boolean = false;

}

class PreStoreCardData {
  id: string;//leaguerPrdCardId
  orderId: string;
  leaguerPrdCardItems: Array<PreStoreCardItem> = new Array<PreStoreCardItem>();
}

export class PreStoreCardItem { //LeaguerPrdCardItem
  itemType: number;

  pgId: string;
  pgName: string;
  pgTypeName: string;
  sellPrice: number;
  defaultImg: string;

  count: number;
  restCount: number;
}




