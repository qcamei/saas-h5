import {Component, ChangeDetectorRef} from '@angular/core';
import {IonicPage, NavParams, ViewController} from "ionic-angular";
import {OrderDetailViewDataMgr} from "./orderDetailViewDataMgr";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {AppRouter} from "../../zmComUtils/AppRouter";
import {StoreGoods} from "../../../bsModule/storeGoods/data/StoreGoods";
import {StoreGoodsSynDataHolder} from "../../../bsModule/storeGoods/StoreGoodsSynDataHolder";
import {Goods} from "../../../bsModule/storeGoods/data/Goods";
import {GoodsType} from "../../../bsModule/storeGoods/data/GoodsType";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {PayItem} from "../../../bsModule/order/data/PayItem";
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
import {OrderDetailMgr} from "../../../bsModule/orderDetail/orderDetailMgr";
import {OrderDetail} from "../../../bsModule/orderDetail/data/OrderDetail";
import {Store} from "../../../bsModule/store/data/Store";
import {DonateDetail} from "../../../bsModule/orderDetail/data/DonateDetail";
import {BuyDetail} from "../../../bsModule/orderDetail/data/BuyDetail";
import {ModalCtrl} from "../../zmComUtils/ModalCtrl";

@IonicPage({
  name: "orderDetail",
  segment: 'orderDetail'
})

@Component({
  template: `
    <zm-page-header title="订单详情"></zm-page-header>
    <zm-page-content *ngIf="viewData.orderDetail">
        <div mb-100-p>
        
              <!--- 客户信息--->
              <zmbLeaguerInfoWithOperate [id]="viewData.orderDetail.leaguerId" [isShowAttention]="false"></zmbLeaguerInfoWithOperate>
            
              <!--- 订单信息--->
              <div>
                 <zmk-title name="订单信息" ></zmk-title>  
                 <zm-col [title]=" '订单编号' " [value]="viewData.orderDetail.number"></zm-col>
                 <zm-col [title]=" '订单状态' " [value]="viewData.orderDetail.status|zmOrderStatusPipe"></zm-col>
                 <zm-col [title]=" '跟进人员' " [value]="viewData.orderDetail.buserName"></zm-col>
                 <zm-col [title]=" '创建时间' " [value]="viewData.orderDetail.createdTime|zmDatePipe"></zm-col>
                 <zm-col [title]=" '付款时间' " [value]="viewData.orderDetail.payTime|zmDatePipe"></zm-col>
              </div>
              
              <!--- 支付信息--->
              <div *ngIf="viewData.orderDetail.status != 0 && viewData.orderDetail.status != 2">
                 <zmb-pay-info [payItems]="viewData.orderDetail.payItems"></zmb-pay-info>
              </div>
                
            <!--- 购买信息--->
            <div *ngIf="viewData.orderDetail.buyDetails && viewData.orderDetail.buyDetails.length>0">
              <zmk-title [name]="'购买信息'" ></zmk-title>
              <div *ngFor="let item of viewData.orderDetail.buyDetails" >
                <zmb-order-detail-item [type]="0" [imgSrc]="item.defaultImg|zmImgPath" [name]="item.pgName" [typeName]="item.typeName" [price]="item.price" [count]="item.count" [discount]="item.discount"></zmb-order-detail-item>
              </div>
            </div>
            
            
            <!---赠送信息--->
            <div *ngIf="viewData.orderDetail.donateDetails && viewData.orderDetail.donateDetails.length>0">
              <zmk-title [name]="'赠送信息'" ></zmk-title>
              <div *ngFor="let item of viewData.orderDetail.donateDetails" >
                <zmb-order-detail-item [type]="1" [imgSrc]="item.defaultImg|zmImgPath" [name]="item.pgName" [typeName]="item.typeName" [price]="item.price" [count]="item.count" [discount]="item.discount"></zmb-order-detail-item>
              </div>
            </div>
            
            <div style="padding:5px 10px;font-size:16px;"fxLayout="row" fxLayoutAlign="end">
              <span>合计: <b>￥{{viewData.orderDetail.discountTotalPrice|number:'1.2-2'}}</b></span>
            </div>
        </div>
    </zm-page-content>
  `
})
export class OrderDetailPage {

  private service: OrderDetailService;
  private viewDataSub: any;
  public viewData: OrderDetailViewData = new OrderDetailViewData;
  public modalCtrl:ModalCtrl;

  constructor(private cdRef: ChangeDetectorRef,
              private viewCtrl: ViewController,
              private navParams: NavParams) {
    this.modalCtrl = ModalCtrl.newCtrl(viewCtrl);

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
    if(!AppUtils.isNullObj(orderDetailTmp)){
      let orderDetailVD: OrderDetailVD = OrderDetailVD.fromOrderDetail(orderDetailTmp);

      orderDetailVD.buyDetails.forEach((item)=>{
        orderDetailVD.discountTotalPrice += parseInt((item.pay*100).toString())/100;
      });

      viewDataTmp.orderDetail = orderDetailVD;
    }

    callback(viewDataTmp);
  }
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
  leaguerId:string;
  number: string;
  buserName:string;

  origin:number;//OrderOriginEnum
  realPay: number;//实付
  cost:number;//应结
  status: number;//OrderStatusEnum
  buyDetails: Array<BuyDetail> = new Array<BuyDetail>();
  donateDetails: Array<DonateDetail>;
  payItems:Array<PayItem> = new Array<PayItem>();
  storeId: number;
  createdTime: number;
  payTime: number;

  totalPrice:number = 0;//商品总价
  discountTotalPrice:number = 0;//折后总价

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
    target.buserName = orderDetail.simpleOrderInfo.buserName;

    target.createdTime = orderDetail.simpleOrderInfo.createdTime;
    target.payTime = orderDetail.simpleOrderInfo.payTime;

    target.leaguerId = orderDetail.simpleLeaguerInfo.id;

    if(orderDetail.payItems && orderDetail.payItems.length>0){
      target.payItems = orderDetail.payItems;
    }
    if(orderDetail.buyDetails && orderDetail.buyDetails.length>0){
      target.buyDetails = orderDetail.buyDetails;
    }
    if(orderDetail.donateDetails && orderDetail.donateDetails.length>0){
      target.donateDetails = orderDetail.donateDetails;
    }

    return target;
  }
}






