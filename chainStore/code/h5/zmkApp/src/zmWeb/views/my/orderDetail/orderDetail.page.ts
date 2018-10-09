import {Component, ChangeDetectorRef} from '@angular/core';
import {IonicPage, NavParams} from "ionic-angular";
import {OrderDetailViewDataMgr} from "./orderDetailViewDataMgr";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {AppRouter} from "../../zmComUtils/AppRouter";
import {OrderMgr} from "../../../bsModule/order/orderMgr";
import {StoreGoods} from "../../../bsModule/storeGoods/data/StoreGoods";
import {StoreGoodsSynDataHolder} from "../../../bsModule/storeGoods/StoreGoodsSynDataHolder";
import {Goods} from "../../../bsModule/storeGoods/data/Goods";
import {GoodsType} from "../../../bsModule/storeGoods/data/GoodsType";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {Constants} from "../../zmComUtils/Constants";
import {PayItem} from "../../../bsModule/order/data/PayItem";
import {OrderUpdateStatusApiForm} from "../../../bsModule/order/apiData/OrderUpdateStatusApiForm";
import {OrderStatusEnum} from "../../../bsModule/order/data/OrderStatusEnum";
import {StoreCardInfo} from "../../../bsModule/storeCardInfo/data/StoreCardInfo";
import {StoreCardInfoSynDataHolder} from "../../../bsModule/storeCardInfo/StoreCardInfoSynDataHolder";
import {StoreProductInfoSynDataHolder} from "../../../bsModule/StoreProductInfo/StoreProductInfoSynDataHolder";
import {StorePackageProjectSynDataHolder} from "../../../bsModule/storePackageProject/StorePackageProjectSynDataHolder";
import {StoreProductInfo} from "../../../bsModule/StoreProductInfo/data/StoreProductInfo";
import {StorePackageProject} from "../../../bsModule/storePackageProject/data/StorePackageProject";
import {PackageProject} from "../../../bsModule/storePackageProject/data/PackageProject";
import {ProductInfo} from "../../../bsModule/StoreProductInfo/data/ProductInfo";
import {ProductCard} from "../../../bsModule/storeCardInfo/data/ProductCard";
import {PrdCardType} from "../../../bsModule/storeCardInfo/data/PrdCardType";
import {ProductType} from "../../../bsModule/StoreProductInfo/data/ProductType";
import {PackageProjectType} from "../../../bsModule/storePackageProject/data/PackageProjectType";
import {BuyTypeEnum} from "../../../bsModule/order/data/BuyTypeEnum";
import {OrderDetailMgr} from "../../../bsModule/orderDetail/orderDetailMgr";
import {OrderDetail} from "../../../bsModule/orderDetail/data/OrderDetail";
import {Store} from "../../../bsModule/store/data/Store";
import {PromotionFlagEnum} from "../../../comModule/enum/PromotionFlagEnum";
import {OrderTrackUpdateStatusForm} from "../../../bsModule/orderTrack/apiData/OrderTrackUpdateStatusForm";
import {OrderTrackStatusEnum} from "../../../bsModule/orderTrack/data/OrderTrackStatusEnum";
import {OrderTrackMgr} from "../../../bsModule/orderTrack/orderTrackMgr";
import {AlertUtils} from "../../zmComUtils/AlertUtils";

@IonicPage({
  name: "orderDetail",
  segment: 'orderDetail'
})

@Component({
  template: `
    <zm-page-header title="订单详情"></zm-page-header>
    <zm-page-content *ngIf="viewData.orderDetail">
        <div mb-100-p>
            <!--- 订单状态--->
            <order-status-comp [origin]="viewData.orderDetail.origin" [orderStatus]="viewData.orderDetail.status" [createTime]="viewData.orderDetail.createdTime"  [type]="viewData.orderDetail.type" [trackStatus]="viewData.orderDetail.trackStatus" [company]="viewData.orderDetail.company" (cancelCallback)="cancelOrderOverTime()"></order-status-comp>
            
            <!--店铺地址信息--> 
            <store-address-comp *ngIf="viewData.orderDetail.type == 0" [storeName]="viewData.store.name" [storeTel]="viewData.store.tel" [storeArea]="viewData.store.area" [address]="viewData.store.address"></store-address-comp>
            
            <div *ngIf="viewData.orderDetail.type == 1">
              <!--物流信息--> 
              <order-track-comp [trackStatus]="viewData.orderDetail.trackStatus" [courierNum]="viewData.orderDetail.courierNum" [company]="viewData.orderDetail.company" [lastUpdateTime]="viewData.orderDetail.lastUpdateTime"></order-track-comp>
              <!--收货人信息-->  
              <order-reciver-comp [receiver]="viewData.orderDetail.receiver" [phone]="viewData.orderDetail.phone"  [address]="viewData.orderDetail.address"></order-reciver-comp>
            </div>
           
             
            <zmk-title name="购买信息" ></zmk-title>
            <zmk-own-itemInfo *ngFor="let item of viewData.orderDetail.buyItems" [imgSrc]="item.pgImg|zmImgPath" [name]="item.pgName" [typeName]="item.pgTypeName" [price]="item.price" [promotionPrice]="item.promotionPrice" [hotSales]="item.promotionFlag" [count]="item.count" [discount]="item.discount"></zmk-own-itemInfo>
            <!--- 订单信息--->
                <div>
                    <zmk-title name="订单信息" ></zmk-title>  
                    <zm-col [title]=" '订单编号' " [value]="viewData.orderDetail.number"></zm-col>
                    <zm-col *ngIf="viewData.orderDetail.origin == 0" [title]=" '订单状态' " [value]="viewData.orderDetail.status|zmOrderStatusPipe"></zm-col>
                    <zm-col *ngIf="viewData.orderDetail.origin == 1" [title]=" '订单状态' " [value]="viewData.orderDetail.trackStatus|zmOrderTrackStatusPipe:viewData.orderDetail.type"></zm-col>
                    <zm-col [title]=" '创建时间' " [value]="viewData.orderDetail.createdTime|zmDatePipe"></zm-col>
                    <zm-col [title]=" '订单来源' " [value]="viewData.orderDetail.origin|zmOrderOriginPipe"></zm-col>
                    <zm-col [title]=" '配送方式' " [value]="viewData.orderDetail.type|zmOrderTrackTypePipe"></zm-col>
                </div>
                
                <!--- 支付方式--->
                <div *ngIf="viewData.orderDetail.status != 0 && viewData.orderDetail.status != 2">
                  <zmk-payinfo [payTime]="viewData.orderDetail.payTime|zmDatePipe" [payItem]="viewData.orderDetail.payItem"></zmk-payinfo>
                </div>
                
                <!--- 总计折扣--->
                <div style="padding:15px 10px;border-top:8px solid #F3F3F3;" w-100 fxLayout="row" fxLayoutAlign="space-between center">
                    <span>商品总计</span>
                    <span>￥{{viewData.orderDetail.totalPrice|number:'1.2-2'}}</span>
                </div>
                <div style="padding:15px 10px;border-top:1px solid #ccc;"w-100 fxLayout="row" fxLayoutAlign="space-between center">
                    <span>折扣总计</span>
                    <span>￥{{(viewData.orderDetail.totalPrice-viewData.orderDetail.discountTotalPrice)|number:'1.2-2'}}</span>
                </div>

                <div style="padding:5px 10px;font-size:16px;border-top:8px solid #F3F3F3;"fxLayout="row" fxLayoutAlign="end">
                  <span>
                    合计: <b>￥{{viewData.orderDetail.discountTotalPrice|number:'1.2-2'}}</b>
                  </span>
                </div>
                
                <div *ngIf="viewData.orderDetail.status == 0" style="padding:8px 10px;font-size:16px;border-top:8px solid #F3F3F3;"fxLayout="row" fxLayoutAlign="end">
                    <button ion-button small outline (click)="cancelOrderClick()">取消订单</button>
                    <button ion-button small (click)="goPay()">去付款</button>
                </div>
               <div *ngIf="viewData.orderDetail.origin==1 && (viewData.orderDetail.trackStatus == 3 || viewData.orderDetail.trackStatus == 4)" style="padding:2px 10px;font-size:16px;"fxLayout="row" fxLayoutAlign="end">
                    <button ion-button small (click)="buyAgain(viewData.orderDetail.id)">再次购买</button>
                  </div>
                  <div *ngIf="viewData.orderDetail.origin==1 && viewData.orderDetail.type==1 && (viewData.orderDetail.trackStatus == 1 || viewData.orderDetail.trackStatus == 2)" style="padding:2px 10px;font-size:16px;"fxLayout="row" fxLayoutAlign="end">
                    <button ion-button small (click)="confirmRecive(viewData.orderDetail.id)">确认收货</button>
                  </div>
                  
                  <div *ngIf="viewData.orderDetail.origin==1 && viewData.orderDetail.type==0 && (viewData.orderDetail.trackStatus == 1 || viewData.orderDetail.trackStatus == 2)" style="padding:2px 10px;font-size:16px;"fxLayout="row" fxLayoutAlign="end">
                    <button ion-button small (click)="confirmRecive(viewData.orderDetail.id)">确认提取</button>
                  </div>
        </div>
    </zm-page-content>
  `
})
export class OrderDetailPage {

  private service: OrderDetailService;
  private viewDataSub: any;
  public viewData: OrderDetailViewData = new OrderDetailViewData;

  constructor(private cdRef: ChangeDetectorRef,
              private navParams: NavParams) {

    this.service = new OrderDetailService();

    let initData = new OrderDetailViewData();
    this.viewDataSub = OrderDetailViewDataMgr.getInstance().onDataChanged(initData, (viewDataP: OrderDetailViewData) => {
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

  goPay() {
    let orderId = this.viewData.orderDetail.id;
    AppRouter.getInstance().goPayTypeSelectPage(orderId);
  }

  buyAgain(orderId: string) {
    AppRouter.getInstance().goAddOrderPageWithId(orderId);
  }

  confirmRecive(orderId:string){
    let storeId = SessionUtil.getInstance().getCurStoreId();
    let tmp = this;
    let updateStatusData: OrderTrackUpdateStatusForm = new OrderTrackUpdateStatusForm();
    updateStatusData.status = OrderTrackStatusEnum.Finish;
    OrderTrackMgr.getInstance().updateOrderTrackState(storeId,orderId,updateStatusData).then((success)=>{
      if(success){
        AppUtils.showSuccess("提示","操作成功");
        tmp.initData();
      }else{
        AppUtils.showError("提示","操作失败");
      }
    });
  }

  //待付款订单2小时内未支付，则取消订单
  cancelOrderOverTime(){
    let orderId = this.viewData.orderDetail.id;
    let state:number = OrderStatusEnum.CANCEL;
    let tmp = this;
    this.service.updateOrderState(orderId, state).then((success)=>{
      if(success){
        tmp.initData();
      }
    });
  }

  cancelOrderClick(){
    AlertUtils.getInstance().showConfirm("取消订单","确定取消订单吗？", this.cancelOrder.bind(this), null);
  }

  cancelOrder() {
    let orderId = this.viewData.orderDetail.id;
    let state:number = OrderStatusEnum.CANCEL;
    let tmp = this;
    this.service.updateOrderState(orderId, state).then(
      (success) => {
          if (success) {
            tmp.service.initViewData(orderId);
            AppUtils.showSuccess("提示", "取消订单成功");
          }else {
            AppUtils.showError("提示", "取消订单失败");
          }
        }
      );
  }

}

export class OrderDetailService {

  constructor() {
  }

  public initViewData(targetId: string) {
    let viewDataTmp = new OrderDetailViewData();
    OrderDetailViewDataMgr.getInstance().setData(viewDataTmp);

    this.buildViewData(targetId, (viewData: OrderDetailViewData) => {
      this.handleViewData(viewData);
    });
  }

  /**
   * 处理回调
   * @param viewDataP
   */
  public handleViewData(viewDataP: OrderDetailViewData) {
    OrderDetailViewDataMgr.getInstance().setData(viewDataP);
  }

  public async buildViewData(orderId: string, callback: (viewDataP: OrderDetailViewData) => void) {
    let viewDataTmp = new OrderDetailViewData();
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

    viewDataTmp.store = await SessionUtil.getInstance().getCurStore();
    let orderDetailTmp: OrderDetail = await OrderDetailMgr.getInstance().get(storeId, orderId);
    let orderDetailVD: OrderDetailVD = OrderDetailVD.fromOrderDetail(orderDetailTmp);
    orderDetailVD.buyItems = this.buildBuyItemList(orderDetailTmp, viewDataTmp);
    orderDetailVD.buyItems.forEach((item)=>{
      orderDetailVD.totalPrice += parseInt((item.cost*100).toString())/100;
      if(item.promotionFlag==PromotionFlagEnum.Yes){
        orderDetailVD.discountTotalPrice += parseInt((item.promotionPrice*item.count*100).toString())/100;
      }
    });
    orderDetailVD.buyItems.forEach((item)=>{
      if(item.promotionFlag==PromotionFlagEnum.No){
        orderDetailVD.discountTotalPrice += parseInt((item.pay*100).toString())/100;
      }
    });
    viewDataTmp.orderDetail = orderDetailVD;
    callback(viewDataTmp);
  }

  private buildBuyItemList(orderDetailTmp: OrderDetail, viewDataTmp:OrderDetailViewData) {
    let buyItems = new Array<BuyItemData>();
    if (orderDetailTmp.buyDetails) {
      for (let buyItem of orderDetailTmp.buyDetails) {
        let itemData = new BuyItemData();
        itemData.pgId = buyItem.pgId;
        itemData.count = buyItem.count;
        itemData.discount = buyItem.discount;
        itemData.price = buyItem.price;
        itemData.cost = buyItem.cost;
        itemData.pay = buyItem.pay;
        itemData.buyType = buyItem.buyType;
        if(itemData.buyType == BuyTypeEnum.PRODUCT) {
          let productInfo: ProductInfo = viewDataTmp.productMap.get(buyItem.pgId);
          if (productInfo) {
            itemData.pgName = productInfo.name;
            itemData.promotionFlag = productInfo.promotionFlag;
            itemData.promotionPrice = productInfo.promotionPrice;
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
        }else if(itemData.buyType == BuyTypeEnum.GOODS){
          let goods: Goods = viewDataTmp.goodsMap.get(buyItem.pgId);
          if (goods) {
            itemData.pgName = goods.name;
            itemData.promotionFlag = goods.promotionFlag;
            itemData.promotionPrice = goods.promotionPrice;
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
        }else if(itemData.buyType == BuyTypeEnum.PACKAGE){
          let packageProject: PackageProject = viewDataTmp.packageProjectMap.get(buyItem.pgId);
          if (packageProject) {
            itemData.pgName = packageProject.name;
            itemData.promotionFlag = packageProject.promotionFlag;
            itemData.promotionPrice = packageProject.promotionPrice;
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
        }else if(itemData.buyType == BuyTypeEnum.PRDCARD){
          let productCard: ProductCard = viewDataTmp.productCardMap.get(buyItem.pgId);
          if (productCard) {
            itemData.pgName = productCard.name;
            itemData.promotionFlag = productCard.promotionFlag;
            itemData.promotionPrice = productCard.promotionPrice;
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

        buyItems.push(itemData);
      }
    }

    return buyItems;
  }

  public updateOrderState(orderId:string, state:number): Promise<boolean> {
    let storeId = SessionUtil.getInstance().getCurStoreId();
    let updateStatusData: OrderUpdateStatusApiForm = new OrderUpdateStatusApiForm();
    updateStatusData.status = state;
    return OrderMgr.getInstance().updateOrderState(storeId,orderId,updateStatusData);
  };

}

export class OrderDetailViewData {
  public goodsMap: ZmMap<Goods>;
  public goodsTypeMap: ZmMap<GoodsType>;

  public productCardMap: ZmMap<ProductCard> = new ZmMap<ProductCard>();//次卡map
  public productCardTypeMap: ZmMap<PrdCardType> = new ZmMap<PrdCardType>();

  public productMap: ZmMap<ProductInfo> = new ZmMap<ProductInfo>();
  public productTypeMap: ZmMap<ProductType> = new ZmMap<ProductType>();

  public packageProjectMap: ZmMap<PackageProject> = new ZmMap<PackageProject>();
  public packageProjectTypeMap: ZmMap<PackageProjectType> = new ZmMap<PackageProjectType>();

  public orderDetail: OrderDetailVD = new OrderDetailVD();
  public store:Store = new Store();

}
export class OrderDetailVD {
  id: string;
  number: string;
  origin:number;//OrderOriginEnum
  realPay: number;//实付
  cost:number;//应结
  status: number;//OrderStatusEnum
  buyItems: Array<BuyItemData> = new Array<BuyItemData>();
  payItem:PayItem = new PayItem();
  storeId: number;
  createdTime: number;
  payTime: number;

  totalPrice:number = 0;//商品总价
  discountTotalPrice:number = 0;//折后总价

  //物流信息
  type:number;
  receiver:string;
  phone:string;
  address:string;
  trackStatus:number;
  //快递公司
  company:string;
  //快递单号
  courierNum:string;
  lastUpdateTime:number;
  constructor() {
  }

  public static fromOrderDetail(orderDetail: OrderDetail) {
    let target = new OrderDetailVD();
    target.id = orderDetail.simpleOrderInfo.orderId;
    target.number = orderDetail.simpleOrderInfo.number;
    target.origin = orderDetail.simpleOrderInfo.origin;
    target.status = orderDetail.simpleOrderInfo.status;
    target.storeId = orderDetail.simpleOrderInfo.storeId;
    target.realPay = orderDetail.simpleOrderInfo.realPay;
    target.cost = orderDetail.simpleOrderInfo.cost;

    target.createdTime = orderDetail.simpleOrderInfo.createdTime;
    target.payTime = orderDetail.simpleOrderInfo.payTime;

    if(orderDetail.payItems && orderDetail.payItems.length>0){
      target.payItem = orderDetail.payItems[0];
    }

    target.type = orderDetail.orderTrack.type;
    target.receiver = orderDetail.orderTrack.receiver;
    target.phone =  orderDetail.orderTrack.phone;
    target.address = orderDetail.orderTrack.address;
    target.trackStatus = orderDetail.orderTrack.status;
    target.company = orderDetail.orderTrack.company;
    target.courierNum = orderDetail.orderTrack.courierNum;
    target.lastUpdateTime = orderDetail.orderTrack.lastUpdateTime;
    return target;
  }
}

class BuyItemData {
  buyType:number;
  pgId: string;
  pgName: string;
  pgImg: string;
  pgTypeId: string;
  pgTypeName: string;

  cost:number;//总价 price*count
  pay:number;//应结  price*count*discount
  price: number;//售价
  count: number;
  discount: number;
  promotionFlag: number;//PromotionFlagEnum
  promotionPrice: number;

}






