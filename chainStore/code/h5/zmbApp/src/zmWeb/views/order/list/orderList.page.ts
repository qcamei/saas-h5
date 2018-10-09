import {Component, ChangeDetectorRef} from '@angular/core';
import {IonicPage} from "ionic-angular";
import {OrderListViewDataMgr} from "./orderListViewDataMgr";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {AppRouter} from "../../zmComUtils/AppRouter";
import {PageResp} from "../../../comModule/asynDao/apiData/PageResp";
import {StoreGoods} from "../../../bsModule/storeGoods/data/StoreGoods";
import {StoreGoodsSynDataHolder} from "../../../bsModule/storeGoods/StoreGoodsSynDataHolder";
import {Goods} from "../../../bsModule/storeGoods/data/Goods";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {GoodsType} from "../../../bsModule/storeGoods/data/GoodsType";
import {Constants} from "../../zmComUtils/Constants";
import {StoreCardInfo} from "../../../bsModule/storeCardInfo/data/StoreCardInfo";
import {StoreCardInfoSynDataHolder} from "../../../bsModule/storeCardInfo/StoreCardInfoSynDataHolder";
import {StoreProductInfoSynDataHolder} from "../../../bsModule/StoreProductInfo/StoreProductInfoSynDataHolder";
import {StoreProductInfo} from "../../../bsModule/StoreProductInfo/data/StoreProductInfo";
import {StorePackageProject} from "../../../bsModule/storePackageProject/data/StorePackageProject";
import {StorePackageProjectSynDataHolder} from "../../../bsModule/storePackageProject/StorePackageProjectSynDataHolder";
import {ProductCard} from "../../../bsModule/storeCardInfo/data/ProductCard";
import {PrdCardType} from "../../../bsModule/storeCardInfo/data/PrdCardType";
import {ProductInfo} from "../../../bsModule/StoreProductInfo/data/ProductInfo";
import {ProductType} from "../../../bsModule/StoreProductInfo/data/ProductType";
import {PackageProject} from "../../../bsModule/storePackageProject/data/PackageProject";
import {PackageProjectType} from "../../../bsModule/storePackageProject/data/PackageProjectType";
import {OrderQueryForm} from "../../../bsModule/order/apiData/OrderQueryForm";
import {OrderOriginEnum} from "../../../bsModule/order/data/OrderOriginEnum";
import {Order} from "../../../bsModule/order/data/Order";
import {OrderMgr} from "../../../bsModule/order/orderMgr";
import {BuyItem} from "../../../bsModule/order/data/BuyItem";
import {BuyTypeEnum} from "../../../bsModule/order/data/BuyTypeEnum";
import {RechargeItem} from "../../../bsModule/order/data/RechargeItem";
import {OrderTypeEnum} from "../../../bsModule/order/data/OrderTypeEnum";
import {TimeSlotEnum} from "../../zmComp/form/date/timeSlot/TimeSlotEnum";
import {TimeSlot} from "../../zmComp/form/date/timeSlot/TimeSlot";

@IonicPage({
  name: "orderList",
  segment: 'orderList'
})

@Component({
  template: `
    <zm-page-header title="订单管理"></zm-page-header>
    <zm-page-content [ftShow]="viewData.totalCount>10" >
    <zm-select-timePeriod [timeSlotEnums]="timeSlotEnums" (action)="findList($event)"></zm-select-timePeriod>
     
       <zm-tabs-custom [tabList]="viewData.orderTabList" [(zmValue)]="viewData.selectedOrderTab" (onChange)="switchOrderTab()"></zm-tabs-custom>

        <div class="order-pull-h" [class.orderViewHeight]="viewData.totalCount<10">
          <div *ngIf="viewData.orderListShow">
            <div *ngFor="let item of viewData.orderListShow">
                <zmb-order-item *ngIf="item" [item]="item" (click)="goOrderDetailPage(item.id)"> </zmb-order-item>
            </div>
          </div>
          <zm-no-data *ngIf="viewData.loadingFinish && viewData.orderListShow && viewData.orderListShow.length==0" ></zm-no-data>
        </div>
      
    </zm-page-content>
    <ion-footer class="bg-white">
        <zm-page [totalSize]="viewData.totalCount" [curPage]="viewData.curPage" (pageChange)="getPageData($event)"></zm-page>
    </ion-footer>
  `
})
export class OrderListPage {
  private service: OrderListService;
  public viewData: OrderListViewData;
  public timeSlotEnums = new Array<TimeSlotEnum>();

  constructor(private cdRef: ChangeDetectorRef) {

    //init
    this.timeSlotEnums.push(TimeSlotEnum.TODAY);
    this.timeSlotEnums.push(TimeSlotEnum.THIS_MONTH);
    this.timeSlotEnums.push(TimeSlotEnum.LAST_MONTH);

    this.service = new OrderListService();
    let initData = new OrderListViewData();
    OrderListViewDataMgr.getInstance().onDataChanged(initData, (viewDataP: OrderListViewData) => {
      this.viewData = viewDataP;
      // this.animateItems = [];
      // this.doForAnimate();
      this.cdRef.markForCheck();
    });

  }

  // animateItems = [];
  //
  // doForAnimate() {
  //   let target = this;
  //   if (target.viewData.orderListShow && target.viewData.orderListShow.length > 0) {
  //     for (let i = 0; i < target.viewData.orderListShow.length; i++) {
  //       setTimeout(function () {
  //         target.animateItems.push(target.viewData.orderListShow[i]);
  //       }, 200 * i + 500);
  //     }
  //   }
  // }

  // ionViewWillEnter() {
  //   this.animateItems = [];
  // }

  // ionViewDidEnter() {
  //   this.service.initViewData();
  // }

  ionViewDidLoad(){
    this.service.initViewData();
  }

  getPageData(curPage:number){
    this.viewData.curPage = curPage;
    this.service.getOrderList(this.viewData);
  }

  goOrderDetailPage(orderId: string) {
    AppRouter.getInstance().goOrderDetailPageWithId(orderId);
  }

  findList(timeSlot: TimeSlot) {
    this.viewData.queryForm.minTime = timeSlot.getMinTime();
    this.viewData.queryForm.maxTime = timeSlot.getMaxTime();
    this.service.getOrderList(this.viewData);
  }

  /**
   * 切换tab
   */
  switchOrderTab() {
    if (!AppUtils.isNullObj(this.viewData.selectedOrderTab)) {
      let status: number = this.viewData.selectedOrderTab.value;
      this.viewData.status = status;
      this.viewData.curPage = 1;
      this.service.getOrderList(this.viewData);
    }
  }
}

class OrderListService {

  public initViewData() {
    OrderListViewDataMgr.getInstance().setData(new OrderListViewData());
    this.buildViewData().then((viewData) => {
      this.handleViewData(viewData);
    });

  }

  /**
   * 处理回调
   * @param viewDataP
   */
  public handleViewData(viewDataP: OrderListViewData) {
    OrderListViewDataMgr.getInstance().setData(viewDataP);
  }

  public async buildViewData(): Promise<OrderListViewData> {
    let viewDataTmp = new OrderListViewData();
    AppUtils.showLoading(viewDataTmp.loadingFinish);

    let buserId = SessionUtil.getInstance().getUserId();
    let storeId = SessionUtil.getInstance().getCurStoreId();

    let storeCardInfo: StoreCardInfo = await StoreCardInfoSynDataHolder.getInstance().getData(storeId);
    if (!AppUtils.isNullObj(storeCardInfo)) {
      viewDataTmp.productCardMap = storeCardInfo.getAllProductCardMap();
      viewDataTmp.productCardTypeMap = storeCardInfo.getAllProductCardTypeMap();
    }

    let storeGoods: StoreGoods = await StoreGoodsSynDataHolder.getInstance().getData(storeId);
    if (!AppUtils.isNullObj(storeGoods)) {
      viewDataTmp.goodsMap = storeGoods.getAllGoodsMap();
      viewDataTmp.goodsTypeMap = storeGoods.getAllGoodsTypeMap();
    }

    let storeProductInfo: StoreProductInfo = await StoreProductInfoSynDataHolder.getInstance().getData(storeId);
    if (!AppUtils.isNullObj(storeProductInfo)) {
      viewDataTmp.productMap = storeProductInfo.getAllProductInfoMap();
      viewDataTmp.productTypeMap = storeProductInfo.getAllProductTypeMap();
    }

    let storePackageProject: StorePackageProject = await StorePackageProjectSynDataHolder.getInstance().getData(storeId);
    if (!AppUtils.isNullObj(storePackageProject)) {
      viewDataTmp.packageProjectMap = storePackageProject.getAllPackageProjectMap();
      viewDataTmp.packageProjectTypeMap = storePackageProject.getAllPackageTypeMap();
    }

    let today = new Date();
    viewDataTmp.queryForm.minTime = AppUtils.getMinTimeInday(today);
    viewDataTmp.queryForm.maxTime = AppUtils.getMaxTimeInday(today);

    let queryForm = new OrderQueryForm();
    queryForm.storeId = storeId;
    queryForm.buserId = buserId;
    queryForm.origin.push(OrderOriginEnum.BUSINESS);
    queryForm.minTime = AppUtils.getMinTimeInday(today);
    queryForm.maxTime = AppUtils.getMaxTimeInday(today);
    let pageResp: PageResp = await OrderMgr.getInstance().findOrderPageInfo(queryForm);
    if (pageResp && pageResp.list) {
      let orderList = this.buildOrderVDList(pageResp.list, viewDataTmp);
      viewDataTmp.totalCount = pageResp.totalCount;
      viewDataTmp.orderListShow = orderList;
    }

    viewDataTmp.loadingFinish = true;
    AppUtils.hideLoading(viewDataTmp.loadingFinish);
    return new Promise<OrderListViewData>(resolve => {
      resolve(viewDataTmp);
    });
  }


  public async  getOrderList(viewDataTmp: OrderListViewData) {
    let buserId = SessionUtil.getInstance().getUserId();
    let storeId = SessionUtil.getInstance().getCurStoreId();

    let queryForm = new OrderQueryForm();
    queryForm.storeId = storeId;
    queryForm.buserId = buserId;
    queryForm.origin.push(OrderOriginEnum.BUSINESS);
    queryForm.pageNo = viewDataTmp.curPage;
    queryForm.minTime = viewDataTmp.queryForm.minTime;
    queryForm.maxTime = viewDataTmp.queryForm.maxTime;
    if (viewDataTmp.status != -1) {
      queryForm.status.push(viewDataTmp.status);
    }
    let pageResp: PageResp = await OrderMgr.getInstance().findOrderPageInfo(queryForm);
    if (pageResp && pageResp.list) {
      let orderList = this.buildOrderVDList(pageResp.list, viewDataTmp);
      viewDataTmp.orderListShow = orderList;
      viewDataTmp.totalCount = pageResp.totalCount;
    }
    this.handleViewData(viewDataTmp);
  }

  private buildOrderVDList(orderListTmp: Array<Order>, viewDataTmp: OrderListViewData) {
    let orderList = new Array<OrderVD>();
    if (!AppUtils.isNullObj(orderListTmp) && orderListTmp.length > 0) {
      for (let order of orderListTmp) {
        let target = OrderVD.fromOrder(order);
        this.buildTargetBuyItems(target, order.buyItems, viewDataTmp);
        orderList.push(target);
      }
    }
    return orderList;
  }

  private buildTargetBuyItems(target: OrderVD, buyItems: Array<BuyItem>, viewDataTmp) {
    for (let buyItem of buyItems) {
      let itemData = new BuyItemData();
      itemData.buyType = buyItem.buyType;
      itemData.pgId = buyItem.pgId;
      if (itemData.buyType == BuyTypeEnum.PRODUCT) {
        let productInfo: ProductInfo = viewDataTmp.productMap.get(buyItem.pgId);
        if (productInfo) {
          itemData.pgName = productInfo.name;
          if (productInfo.defaultImg) {
            itemData.pgImg = productInfo.defaultImg;
          } else {
            itemData.pgImg = Constants.PRODUCT_DEFAULT_IMG;
          }
          let productType: ProductType = viewDataTmp.productTypeMap.get(productInfo.typeId);
          if (productType) {
            itemData.pgTypeName = productType.name;
          }
        }
      } else if (itemData.buyType == BuyTypeEnum.GOODS) {
        let goods: Goods = viewDataTmp.goodsMap.get(buyItem.pgId);
        if (goods) {
          itemData.pgName = goods.name;
          if (goods.defaultImg) {
            itemData.pgImg = goods.defaultImg;
          } else {
            itemData.pgImg = Constants.GOODS_DEFAULT_IMG;
          }
          let goodsType: GoodsType = viewDataTmp.goodsTypeMap.get(goods.typeId);
          if (goodsType) {
            itemData.pgTypeName = goodsType.name;
          }
        }
      } else if (itemData.buyType == BuyTypeEnum.PACKAGE) {
        let packageProject: PackageProject = viewDataTmp.packageProjectMap.get(buyItem.pgId);
        if (packageProject) {
          itemData.pgName = packageProject.name;
          if (packageProject.defaultImg) {
            itemData.pgImg = packageProject.defaultImg;
          } else {
            itemData.pgImg = Constants.PACKAGE_DEFAULT_IMG;
          }
          let packageProjectType: PackageProjectType = viewDataTmp.packageProjectTypeMap.get(packageProject.typeId);
          if (packageProjectType) {
            itemData.pgTypeName = packageProjectType.name;
          }
        }
      } else if (itemData.buyType == BuyTypeEnum.PRDCARD) {
        let productCard: ProductCard = viewDataTmp.productCardMap.get(buyItem.pgId);
        if (productCard) {
          itemData.pgName = productCard.name;
          if (productCard.imgPath) {
            itemData.pgImg = productCard.imgPath;
          } else {
            itemData.pgImg = Constants.PRDCARD_DEFAULT_IMG;
          }
          let productCardType: PrdCardType = viewDataTmp.productCardTypeMap.get(productCard.typeId);
          if (productCardType) {
            itemData.pgTypeName = productCardType.name;
          }
        }
      }
      target.buyItems.push(itemData);
    }
  }

}

export class OrderListViewData {
  public goodsMap: ZmMap<Goods>;
  public goodsTypeMap: ZmMap<GoodsType>;

  public productCardMap: ZmMap<ProductCard> = new ZmMap<ProductCard>();//次卡map
  public productCardTypeMap: ZmMap<PrdCardType> = new ZmMap<PrdCardType>();

  public productMap: ZmMap<ProductInfo> = new ZmMap<ProductInfo>();
  public productTypeMap: ZmMap<ProductType> = new ZmMap<ProductType>();

  public packageProjectMap: ZmMap<PackageProject> = new ZmMap<PackageProject>();
  public packageProjectTypeMap: ZmMap<PackageProjectType> = new ZmMap<PackageProjectType>();

  //到店订单
  public queryForm: OrderQueryForm = new OrderQueryForm();
  public status: number = -1;
  public orderListShow: Array<OrderVD> = new Array<OrderVD>();
  public orderTabList = [{name: '全部', value: -1}, {name: '待收款', value: 0}, {name: '已收款', value: 1},
    {name: '退款', value: 3}];
  public selectedOrderTab: any = this.orderTabList[0];
  public totalCount:number = 0;
  public curPage:number = 1;

  public loadingFinish: boolean = false;

}
export class OrderVD {
  id: string;
  number: string;//订单号
  leaguerName: string;
  realPay: number;
  totalPrice: number;//总计 折前
  status: number;//OrderStatusEnum
  origin: number;//OrderOriginEnum
  orderType: number;//OrderTypeEnum
  rechargeItem: RechargeItem;//会员充值
  buyItems: Array<BuyItemData> = new Array<BuyItemData>();


  constructor() {
  }

  public static fromOrder(order: Order) {
    let target = new OrderVD();
    target.id = order.id;
    target.number = order.number;
    target.leaguerName = order.name;
    target.status = order.status;
    target.origin = order.origin;
    target.realPay = order.realPay;
    target.orderType = order.orderType;
    target.totalPrice = order.cost;
    if (order.orderType == OrderTypeEnum.RECHARGE) {
      target.totalPrice = order.rechargeItems[0].pay;
    }
    if (order.rechargeItems && order.rechargeItems.length > 0) {
      target.rechargeItem = order.rechargeItems[0];
    }
    return target;
  }
}

class BuyItemData {
  buyType: number;
  pgId: string;
  pgName: string;
  pgImg: string;
  pgTypeName: string;
}






