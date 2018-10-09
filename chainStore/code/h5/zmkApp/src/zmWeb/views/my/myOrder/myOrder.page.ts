import {Component, ChangeDetectorRef} from '@angular/core';
import {IonicPage} from "ionic-angular";
import {MyOrderViewDataMgr} from "./myOrderViewDataMgr";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {AppRouter} from "../../zmComUtils/AppRouter";
import {OrderMgr} from "../../../bsModule/order/orderMgr";
import {PageResp} from "../../../comModule/asynDao/apiData/PageResp";
import {OrderQueryForm} from "../../../bsModule/order/apiData/OrderQueryForm";
import {Order} from "../../../bsModule/order/data/Order";
import {StoreGoods} from "../../../bsModule/storeGoods/data/StoreGoods";
import {StoreGoodsSynDataHolder} from "../../../bsModule/storeGoods/StoreGoodsSynDataHolder";
import {Goods} from "../../../bsModule/storeGoods/data/Goods";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {GoodsType} from "../../../bsModule/storeGoods/data/GoodsType";
import {Store} from "../../../bsModule/store/data/Store";
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
import {BuyTypeEnum} from "../../../bsModule/order/data/BuyTypeEnum";
import {MallOrderQueryForm} from "../../../bsModule/order/apiData/MallOrderQueryForm";
import {MallOrder} from "../../../bsModule/order/data/MallOrder";
import {BuyItem} from "../../../bsModule/order/data/BuyItem";
import {OrderOriginEnum} from "../../../bsModule/order/data/OrderOriginEnum";
import {OrderTrackMgr} from "../../../bsModule/orderTrack/orderTrackMgr";
import {OrderTrackUpdateStatusForm} from "../../../bsModule/orderTrack/apiData/OrderTrackUpdateStatusForm";
import {OrderTrackStatusEnum} from "../../../bsModule/orderTrack/data/OrderTrackStatusEnum";

@IonicPage({
  name: "myOrder",
  segment: 'myOrder'
})

@Component({
  template: `
    <zm-page-header title="我的订单"></zm-page-header>
    <zm-page-content [ftShow]="viewData.mallOrderTotalCount>10 || viewData.orderTotalCount>10">
      <div mb-100-p>
      
        <div *ngIf="viewData.tabNumber==0">
          <div  w-100 style="z-index:9999; top:44px;left:0;">
             <div class="shopping-tab" fxLayout="row" fxLayoutAlign="center center" style="padding:10px 0;">
               <span [class.active]="viewData.tabNumber==0" (click)="click(0)">商城购买</span>
               <span [class.active]="viewData.tabNumber==1" (click)="click(1)">到店购买</span>
             </div>
             <zm-tabs-custom [tabList]="viewData.mallTabList" [(zmValue)]="viewData.selectedMallTab" (onChange)="switchMallTab()"></zm-tabs-custom>
          </div>  
          <div  class="order-pull-h" [ngClass]="{'orderViewHeight':viewData.mallOrderTotalCount <= 10}">
              <div  *ngFor="let item of viewData.mallOrderListShow">
                  <zmk-order-item *ngIf="item" [item]="item" (click)="goOrderDetailPage(item.id)" (callback)="confirmRecive($event)"> </zmk-order-item>
              </div>
              <zm-no-data *ngIf="viewData.loadingFinish && viewData.mallOrderListShow.length==0" ></zm-no-data>
          </div>
        </div>
        
        <div *ngIf="viewData.tabNumber==1">
            <div  w-100 style="z-index:9999; top:44px;left:0;">
           <div class="shopping-tab" fxLayout="row" fxLayoutAlign="center center" style="padding:10px 0;">
             <span [class.active]="viewData.tabNumber==0" (click)="click(0)">商城购买</span>
             <span [class.active]="viewData.tabNumber==1" (click)="click(1)">到店购买</span>
           </div>
           <zm-tabs-custom [tabList]="viewData.orderTabList" [(zmValue)]="viewData.selectedOrderTab" (onChange)="switchOrderTab()"></zm-tabs-custom>
        </div>  
        <div class="order-pull-h" [ngClass]="{'orderViewHeight':viewData.orderTotalCount <= 10}">
          <div *ngIf="animateItems">
            <div *ngFor="let item of viewData.orderListShow">
                <zmk-order-item *ngIf="item" [item]="item" (click)="goOrderDetailPage(item.id)"> </zmk-order-item>
            </div>
          </div>
          <zm-no-data *ngIf="viewData.loadingFinish && viewData.orderListShow && viewData.orderListShow.length==0" ></zm-no-data>
        </div>
        </div>
        
      </div>
    </zm-page-content>
    
    <ion-footer class="bg-white">
        <div *ngIf="viewData.tabNumber==0">
          <zm-page [totalSize]="viewData.mallOrderTotalCount"  [curPage]="viewData.mallOrderPageNo" (pageChange)="mallOrderPageChange($event)"></zm-page>
        </div>
        <div *ngIf="viewData.tabNumber==1">
                 <zm-page [totalSize]="viewData.orderTotalCount"  [curPage]="viewData.orderPageNo" (pageChange)="orderPageChange($event)"></zm-page>

        </div>
    </ion-footer>
  `,
  styles: [`
  .shopping-tab{
    background:#fff;
  }
  .shopping-tab span{
    border:1px solid #4678FA;
    background:#f7f7f7;
    color:#4678FA;
    border-radius:5px;
    padding:5px 10px;
    margin-right:10px;
  }
  .active{
    background:#4678FA !important;
    color:#fff !important;
  }
  `]
})
export class MyOrderPage {
  private service: MyOrderService;
  private viewDataSub: any;
  public viewData: MyOrderViewData = new MyOrderViewData;

  constructor(private cdRef: ChangeDetectorRef) {

    this.service = new MyOrderService();

    let initData = new MyOrderViewData();
    this.viewDataSub = MyOrderViewDataMgr.getInstance().onDataChanged(initData, (viewDataP: MyOrderViewData) => {
      this.viewData = viewDataP;
      // this.animateItems = [];
      // this.animateMallItems = [];
      // this.doForAnimate();
      // this.doForMallAnimate();
      this.cdRef.markForCheck();
    });

  }

  click(n) {
    this.viewData.tabNumber = n;
    if (this.viewData.tabNumber == 1) {
      this.switchOrderTab();
    } else {
      this.switchMallTab();
    }
  }

  animateItems = [];
  // animateMallItems = [];
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
  //
  // doForMallAnimate() {
  //   let target = this;
  //   if (target.viewData.mallOrderListShow && target.viewData.mallOrderListShow.length > 0) {
  //     for (let i = 0; i < target.viewData.mallOrderListShow.length; i++) {
  //       setTimeout(function () {
  //         target.animateMallItems.push(target.viewData.mallOrderListShow[i]);
  //       }, 200 * i + 500);
  //     }
  //   }
  // }
  //
  // ionViewWillEnter() {
  //   this.animateItems = [];
  //   this.animateMallItems = [];
  // }

  ionViewDidEnter() {
    this.service.initViewData();
  }

  async orderPageChange(pageNoP: number) {
    this.viewData.orderPageNo = pageNoP;
    await this.service.getOrderList(this.viewData);
  }

  async mallOrderPageChange(pageNoP: number) {
    this.viewData.mallOrderPageNo = pageNoP;
    await this.service.getMallOrderList(this.viewData);
  }

  goOrderDetailPage(orderId: string) {
    AppRouter.getInstance().goOrderDetailPage(orderId);
  }

  /**
   * 切换tab
   */
  async switchMallTab() {
    if (!AppUtils.isNullObj(this.viewData.selectedMallTab)) {
      this.viewData.mallOrderStatus = this.viewData.selectedMallTab.value;
      this.viewData.mallOrderPageNo = 1;
      await this.service.getMallOrderList(this.viewData);
    }
  }

  async switchOrderTab() {
    if (!AppUtils.isNullObj(this.viewData.selectedOrderTab)) {
      this.viewData.orderStatus = this.viewData.selectedOrderTab.value;
      this.viewData.orderPageNo = 1;
      await this.service.getOrderList(this.viewData);
    }
  }

  confirmRecive(orderId: string) {
    let storeId = SessionUtil.getInstance().getCurStoreId();
    let updateStatusData: OrderTrackUpdateStatusForm = new OrderTrackUpdateStatusForm();
    updateStatusData.status = OrderTrackStatusEnum.Finish;
    OrderTrackMgr.getInstance().updateOrderTrackState(storeId, orderId, updateStatusData).then((success) => {
      if (success) {
        AppUtils.showSuccess("提示", "操作成功");
        this.service.initViewData();
      } else {
        AppUtils.showError("提示", "操作失败");
      }
    });
  }

}

export class MyOrderService {

  constructor() {
  }

  public initViewData() {
    let viewDataTmp = new MyOrderViewData();
    MyOrderViewDataMgr.getInstance().setData(viewDataTmp);

    this.buildViewData().then((viewData) => {
      this.handleViewData(viewData);
    });

  }


  /**
   * 处理回调
   * @param viewDataP
   */
  public handleViewData(viewDataP: MyOrderViewData) {
    MyOrderViewDataMgr.getInstance().setData(viewDataP);
  }

  public async buildViewData(): Promise<MyOrderViewData> {
    let viewDataTmp = new MyOrderViewData();
    AppUtils.showLoading(viewDataTmp.loadingFinish);

    let cuserId = SessionUtil.getInstance().getLoginCUserId();
    let storeId = SessionUtil.getInstance().getCurStoreId();
    let store = await SessionUtil.getInstance().getCurStore();
    let leaguerId = AppUtils.format("{0}_{1}", storeId, cuserId);

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

    let queryForm = new MallOrderQueryForm();
    queryForm.storeId = storeId;
    queryForm.leaguerId = leaguerId;
    queryForm.pageNo = viewDataTmp.mallOrderPageNo;
    let pageResp: PageResp<MallOrder> = await OrderMgr.getInstance().findMallOrderPage(queryForm);
    if (pageResp && pageResp.list) {
      let orderList = this.buildOrderVDList(store, null, pageResp.list, viewDataTmp);
      viewDataTmp.mallOrderListShow = orderList;
      viewDataTmp.mallOrderTotalCount = pageResp.totalCount;
    }

    viewDataTmp.loadingFinish = true;
    AppUtils.hideLoading(viewDataTmp.loadingFinish);
    return new Promise<MyOrderViewData>(resolve => {
      resolve(viewDataTmp);
    });
  }

  public async  getOrderList(viewDataTmp: MyOrderViewData) {
    let cuserId = SessionUtil.getInstance().getLoginCUserId();
    let storeId = SessionUtil.getInstance().getCurStoreId();
    let store = await SessionUtil.getInstance().getCurStore();
    let leaguerId = AppUtils.format("{0}_{1}", storeId, cuserId);

    let queryForm = new OrderQueryForm();
    queryForm.storeId = storeId;
    queryForm.leaguerId = leaguerId;
    queryForm.pageNo = viewDataTmp.orderPageNo;
    queryForm.origin.push(OrderOriginEnum.BUSINESS);
    let status = viewDataTmp.orderStatus;
    if (!AppUtils.isNullOrWhiteSpace(status)) {
      let stateArr = status.toString().split(",");
      stateArr.forEach((state: string) => {
        if (state != '-1') {
          queryForm.status.push(parseInt(state));
        }
      });
    }
    let pageResp: PageResp<Order> = await OrderMgr.getInstance().findOrderPageInfo(queryForm);
    if (pageResp && pageResp.list) {
      let orderList = this.buildOrderVDList(store, pageResp.list, null, viewDataTmp);
      viewDataTmp.orderListShow = orderList;
      viewDataTmp.orderTotalCount = pageResp.totalCount;
    }
    this.handleViewData(viewDataTmp);
  }

  public async  getMallOrderList(viewDataTmp: MyOrderViewData) {
    let cuserId = SessionUtil.getInstance().getLoginCUserId();
    let storeId = SessionUtil.getInstance().getCurStoreId();
    let store = await SessionUtil.getInstance().getCurStore();
    let leaguerId = AppUtils.format("{0}_{1}", storeId, cuserId);

    let queryForm = new MallOrderQueryForm();
    queryForm.storeId = storeId;
    queryForm.leaguerId = leaguerId;
    queryForm.pageNo = viewDataTmp.mallOrderPageNo;
    let status = viewDataTmp.mallOrderStatus;
    if (!AppUtils.isNullOrWhiteSpace(status)) {
      let stateArr = status.toString().split(",");
      stateArr.forEach((state: string) => {
        if (state != '-1') {
          queryForm.status.push(parseInt(state));
        }
      });
    }
    let pageResp: PageResp<MallOrder> = await OrderMgr.getInstance().findMallOrderPage(queryForm);
    if (pageResp && pageResp.list) {
      let orderList = this.buildOrderVDList(store, null, pageResp.list, viewDataTmp);
      viewDataTmp.mallOrderListShow = orderList;
      viewDataTmp.mallOrderTotalCount = pageResp.totalCount;
    }
    this.handleViewData(viewDataTmp);
  }

  private buildOrderVDList(store: Store, orderListTmp: Array<Order>, mallOrderListTmp: Array<MallOrder>, viewDataTmp: MyOrderViewData) {
    let orderList = new Array<OrderVD>();
    if (!AppUtils.isNullObj(orderListTmp) && orderListTmp.length > 0) {
      for (let order of orderListTmp) {
        let target = OrderVD.fromOrder(order);
        target.storeName = store.name;
        this.buildTargetBuyItems(target, order.buyItems, viewDataTmp);
        orderList.push(target);
      }
    }

    if (!AppUtils.isNullObj(mallOrderListTmp) && mallOrderListTmp.length > 0) {
      for (let mallOrder of mallOrderListTmp) {
        let target = OrderVD.fromMallOrder(mallOrder);
        target.storeName = store.name;
        this.buildTargetBuyItems(target, mallOrder.order.buyItems, viewDataTmp);
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
          itemData.promotionFlag = productInfo.promotionFlag;
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
          itemData.promotionFlag = goods.promotionFlag;
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
          itemData.promotionFlag = packageProject.promotionFlag;
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
          itemData.promotionFlag = productCard.promotionFlag;
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

export class MyOrderViewData {
  public goodsMap: ZmMap<Goods>;
  public goodsTypeMap: ZmMap<GoodsType>;

  public productCardMap: ZmMap<ProductCard> = new ZmMap<ProductCard>();//次卡map
  public productCardTypeMap: ZmMap<PrdCardType> = new ZmMap<PrdCardType>();

  public productMap: ZmMap<ProductInfo> = new ZmMap<ProductInfo>();
  public productTypeMap: ZmMap<ProductType> = new ZmMap<ProductType>();

  public packageProjectMap: ZmMap<PackageProject> = new ZmMap<PackageProject>();
  public packageProjectTypeMap: ZmMap<PackageProjectType> = new ZmMap<PackageProjectType>();

  public tabNumber: number = 0;

  //到店订单
  public orderStatus: string = '-1';
  public queryForm: OrderQueryForm = new OrderQueryForm();
  public orderListShow: Array<OrderVD> = new Array<OrderVD>();
  public orderTabList = [{name: '全部', value: '-1'}, {name: '待付款', value: '0'}, {name: '已完成', value: '1'},{name: '退单', value: '3,4'}];
  public selectedOrderTab: any = this.orderTabList[0];
  public orderPageNo: number = 1;
  public orderTotalCount: number;

  //商城订单
  public mallOrderStatus: string = '-1';
  public mallOrderListShow: Array<OrderVD> = new Array<OrderVD>();
  public mallTabList = [{name: '全部', value: '-1'}, {name: '待付款', value: '0'}, {name: '待收货', value: '1,2'}, {name: '已完成',value: '3'}, {name: '已取消', value: '4'}];
  public selectedMallTab: any = this.mallTabList[0];
  public mallOrderPageNo: number = 1;
  public mallOrderTotalCount: number;

  public loadingFinish: boolean = false;
}
export class OrderVD {
  id: string;
  number: string;
  realPay: number;
  status: number;//OrderStatusEnum
  origin: number;//OrderOriginEnum
  buyItems: Array<BuyItemData> = new Array<BuyItemData>();
  storeId: number;
  storeName: string;
  trackStatus: number;
  type: number;//OrderTrackTypeEnum

  constructor() {
  }

  public static fromOrder(order: Order) {
    let target = new OrderVD();
    target.id = order.id;
    target.number = order.number;
    target.status = order.status;
    target.origin = order.origin;
    target.storeId = order.storeId;
    target.realPay = order.realPay;
    return target;
  }

  public static fromMallOrder(mallOrder: MallOrder) {
    let target = new OrderVD();
    target.id = mallOrder.order.id;
    target.number = mallOrder.order.number;
    target.status = mallOrder.order.status;
    target.origin = mallOrder.order.origin;
    target.storeId = mallOrder.order.storeId;
    target.realPay = mallOrder.order.realPay;
    target.trackStatus = mallOrder.trackStatus;
    target.type = mallOrder.type;
    return target;
  }
}

class BuyItemData {
  buyType: number;
  pgId: string;
  pgName: string;
  pgImg: string;
  pgTypeName: string;
  promotionFlag: number;
}






