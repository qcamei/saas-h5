import {Component, ChangeDetectorRef} from '@angular/core';
import {IonicPage} from "ionic-angular";
import {MyProductCardViewDataMgr} from "./myProductCardViewDataMgr";
import {StoreCardInfoSynDataHolder} from "../../../bsModule/storeCardInfo/StoreCardInfoSynDataHolder";
import {LeaguerDetail} from "../../../bsModule/leaguerDetail/data/LeaguerDetail";
import {ZmMap, AppUtils} from "../../../comModule/AppUtils";
import {StoreCardInfo} from "../../../bsModule/storeCardInfo/data/StoreCardInfo";
import {LeaguerProductCard} from "../../../bsModule/storeLeaguerInfo/data/LeaguerProductCard";
import {LeaguerDetailMgr} from "../../../bsModule/leaguerDetail/LeaguerDetailMgr";
import {ProductCard} from "../../../bsModule/storeCardInfo/data/ProductCard";
import {AppRouter} from "../../zmComUtils/AppRouter";
import {SessionUtil} from "../../../comModule/session/SessionUtil";

@IonicPage({
  name: "myProductCard",
  segment: 'myProductCard'
})

@Component({
  template: `
  <zm-page-header title="次卡列表"></zm-page-header>
  <zm-page-content>
    <zmk-store-card  *ngFor="let item of viewData.productCardListTmp" [status]="item.status" [imgPath]="item.imgPath" [name]="item.name" (callback)="goPrdCardDetailPage(item.id)"></zmk-store-card>
    <zm-no-data *ngIf="viewData.loadingFinish && viewData.productCardListTmp.length == 0" ></zm-no-data>
  </zm-page-content>
  <ion-footer class="bg-white">
       <zm-page [totalSize]="viewData.totalCount"  [curPage]="viewData.pageNo" (pageChange)="pageChange($event)"></zm-page>
    </ion-footer>
  `
})
export class MyProductCardPage {

  private service: MyProductCardService;
  private viewDataSub: any;
  public viewData: MyProductCardViewData = new MyProductCardViewData;

  constructor(private cdRef: ChangeDetectorRef) {

    this.service = new MyProductCardService();

    let initData = new MyProductCardViewData();

    this.viewDataSub = MyProductCardViewDataMgr.getInstance().onDataChanged(initData, (viewDataP: MyProductCardViewData) => {
      this.viewData = viewDataP;
      // this.doForAnimate();
      this.cdRef.markForCheck();
    });

  }

  // animateItems = [];
  // doForAnimate() {
  //   let target = this;
  //   for (let i = 0; i < target.viewData.productCardList.length; i++) {
  //     setTimeout(function () {
  //       target.animateItems.push(target.viewData.productCardList[i]);
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
    this.viewData.productCardListTmp = AppUtils.getPageData(pageNoP,this.viewData.productCardList);
    this.service.handleViewData(this.viewData);
  }

  goPrdCardDetailPage(prdCardId: string) {
    AppRouter.getInstance().goPrdCardDetailPage(prdCardId);
  }

}

export class MyProductCardService {

  constructor() {
  }

  public initViewData() {
    let viewDataTmp = new MyProductCardViewData();
    MyProductCardViewDataMgr.getInstance().setData(viewDataTmp);

    this.buildViewData((viewData: MyProductCardViewData) => {
      this.handleViewData(viewData);
    });
  }

  /**
   * 处理回调
   * @param viewDataP
   */
  public handleViewData(viewDataP: MyProductCardViewData) {
    MyProductCardViewDataMgr.getInstance().setData(viewDataP);
  }

  public async buildViewData(callback: (viewDataP: MyProductCardViewData) => void) {
    let viewDataTmp = new MyProductCardViewData();
    AppUtils.showLoading(viewDataTmp.loadingFinish);
    let cuserId = SessionUtil.getInstance().getLoginCUserId();
    let storeId = SessionUtil.getInstance().getCurStoreId();

    let storeCardInfo: StoreCardInfo = await StoreCardInfoSynDataHolder.getInstance().getData(storeId);
    if (!AppUtils.isNullObj(storeCardInfo)) {
      viewDataTmp.productCardMap = storeCardInfo.getAllProductCardMap();
    }

    let leaguerId = AppUtils.format("{0}_{1}", storeId, cuserId);
    let leaguerDetail: LeaguerDetail = await LeaguerDetailMgr.getInstance().get(storeId, leaguerId);
    if (!AppUtils.isNullObj(leaguerDetail)) {
      viewDataTmp.leaguer = leaguerDetail;
    }
    //会员相关次卡
    if (viewDataTmp.leaguer.leaguerProductCardMap) {
      let prdCardDataList: Array<LeaguerProductCard> = viewDataTmp.leaguer.getLeaguerProductCardMap().values();
      console.log(prdCardDataList.length);
      viewDataTmp.productCardList = this.buildList(prdCardDataList, viewDataTmp.productCardMap);
      viewDataTmp.totalCount = viewDataTmp.productCardList.length;
      console.log(viewDataTmp.totalCount);
      viewDataTmp.productCardListTmp = AppUtils.getPageData(1,viewDataTmp.productCardList);
    }
    viewDataTmp.loadingFinish = true;
    AppUtils.hideLoading(viewDataTmp.loadingFinish);
    callback(viewDataTmp);
  }

  private buildList(prdCardDataList: Array<LeaguerProductCard>, productCardMap: ZmMap<ProductCard>) {

    let targetList: Array<MyPrdCardVD> = new Array<MyPrdCardVD>();
    for (let item of prdCardDataList) {
      if (item.cardId) {
        let productCard = productCardMap.get(item.cardId);
        let target = new MyPrdCardVD();
        target.id = item.id;
        target.cardId = item.cardId;
        target.name = productCard.name;
        target.status = item.state;
        target.imgPath = productCard.imgPath;
        targetList.push(target);
      }
    }
    return targetList;
  }
}

export class MyProductCardViewData {

  public leaguer: LeaguerDetail = new LeaguerDetail();//当前会员
  public productCardMap: ZmMap<ProductCard> = new ZmMap<ProductCard>();//次卡map

  public productCardList: Array<MyPrdCardVD> = new Array();
  public productCardListTmp: Array<MyPrdCardVD> = new Array();
  public totalCount:number = 0;
  public pageNo:number = 1;

  public loadingFinish: boolean = false;
}
export class MyPrdCardVD {
  id: string;//leaguerPrdCardId
  cardId: string;
  name: string;
  status:number;
  imgPath: string;
}





