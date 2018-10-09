import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy} from "@angular/core";
import {AppUtils} from "../../../comModule/AppUtils";
import {ActivatedRoute} from "@angular/router";
import {OrderViewDataMgr} from "../orderViewDataMgr";
import {OrderDetailMgr} from "../../../bsModule/orderDetail/OrderDetailMgr";
import {OrderDetail} from "../../../bsModule/orderDetail/data/OrderDetail";
import {PayItemData} from "../../zmComp/form/zmPay/PayItemData";
import {PayTypeEnum} from "../../../bsModule/order/data/PayTypeEnum";
import {AppRouter} from "../../../comModule/AppRouter";
import {PayCompViewData} from "./payComp/payCompViewData";
import {LeaguerDetailMgr} from "../../../bsModule/leaguerDetail/LeaguerDetailMgr";
import {UnPayPopup} from "./unPayPopup";
import {OrderStatusEnum} from "../../../bsModule/order/data/OrderStatusEnum";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";

/**
 * 支付收款页面
 */
@Component({
  selector:'recharge-pay',
  template:`

       <div animation-modal role="pay" class="disflex" style="background: #EBEFF5;padding:10px;min-height:100%;overflow-y: scroll;">
          
        <!--充值信息-->
        <div style="margin-right:20px; width:45%; flex-shrink: 0;">
        
        <div class="bgc mg-b-12 radius pd-lr-20 pd-tb-13">
          <p class="title color-default font-bold lh40">合计</p>
         
          <p class="content disflex justify-space pd-lr-20 fz-14"><span>应结</span><span>&yen;{{viewData.pay | number:'1.2-2'}}</span></p>
        </div>
        
        <div class="bgc radius pd-lr-20 pd-tb-13">
          <p class="title color-default font-bold lh40">会员充值</p>
          <p class="content disflex justify-space pd-lr-20 fz-14"><span>充值金额</span><span>￥{{viewData.pay | number:'1.2-2'}}</span></p>
          <p class="content disflex justify-space pd-lr-20 fz-14"><span>额外赠送</span><span>￥{{viewData.largess | number:'1.2-2'}}</span></p>
          <p class="content disflex justify-space pd-lr-20 fz-14"><span>实充金额</span><span>￥{{viewData.amount | number:'1.2-2'}}</span></p>
        </div>
      
      </div>  
        <!--支付组件-->
        <pay-comp *ngIf="viewData.orderDetail.simpleOrderInfo&&viewData.orderDetail.simpleOrderInfo.status == 0" [viewData]="viewData.payCompData" (callback)="payCallback()" (refreshCallback)="refresh()"></pay-comp>
        
        <!--支付完成后显示的信息-->
        <div *ngIf="viewData.orderDetail.simpleOrderInfo&&viewData.orderDetail.simpleOrderInfo.status == 1"  class="w-45-p">
          <div class="bgc mg-b-12 radius pd-lr-20 pd-tb-13">
            <p class="title color-default font-bold lh40">订单信息</p>
            <p fxLayout="row" fxLayoutGap="40px" class="content pd-lr-20 fz-14"><span>创建时间</span><span>{{viewData.orderDetail.simpleOrderInfo.createdTime|times}}</span></p>
            <p fxLayout="row" fxLayoutGap="40px" class="content pd-lr-20 fz-14"><span>订单编号</span><span>{{viewData.orderDetail.simpleOrderInfo.number}}</span></p>
            <p fxLayout="row" fxLayoutGap="40px" class="content pd-lr-20 fz-14"><span>订单类型</span><span>{{viewData.orderDetail.simpleOrderInfo.orderType|orderTypePipe}}</span></p>
            <p fxLayout="row" fxLayoutGap="40px" class="content pd-lr-20 fz-14"><span>跟进人员</span><span>{{viewData.orderDetail.simpleOrderInfo.buserName}}</span></p>
            <p fxLayout="row" fxLayoutGap="40px" class="content pd-lr-20 fz-14"><span>订单状态</span><span>{{viewData.orderDetail.simpleOrderInfo.status|orderStatusPipe}}</span></p>
            <p fxLayout="row" fxLayoutGap="40px" class="content pd-lr-20 fz-14"><span>应结金额</span><span class="text-bold">￥{{viewData.orderDetail.simpleOrderInfo.cost}}</span></p>
          </div>

          <div class="bgc mg-b-12 radius pd-lr-20 pd-tb-13">
            <p fxLayout="row" fxLayoutGap="40px" class="title color-default font-bold lh40">支付信息</p>
            <p fxLayout="row" fxLayoutGap="40px" class="content pd-lr-20 fz-14"><span>付款时间</span><span>{{viewData.orderDetail.simpleOrderInfo.payTime|times}}</span></p>
            <div *ngFor="let item of viewData.orderDetail.payItems">
                <p fxLayout="row" fxLayoutGap="40px" class="bg-content pd-lr-20 fz-14"><span>交易流水</span><span>{{item.tradeNo?item.tradeNo:'-'}}</span></p>
                <p fxLayout="row" fxLayoutGap="40px" class="bg-content pd-lr-20 fz-14"><span>支付方式</span><span>{{item.payType|orderPayTypePipe}}</span></p>
                <p fxLayout="row" fxLayoutGap="40px" class="bg-content pd-lr-20 fz-14"><span>支付金额</span><span class="text-bold">￥{{item.cost}}</span></p>
            </div>
          </div>
        </div>
        <!--支付完成后显示的信息end-->
        
       </div>
  `,
  styles:[`
      :host{
        height:100%;
      }
      .pay{
        height: 100px;
        align-items: center;
      }
      .bgc{
        background-color: #fff;
      }
      .mg-b-12{
        margin-bottom:12px;
      }
      .mg-r-5{
        margin-right: 5px;
      }
      .mg-lr-30{
        margin-left:30px;
        margin-right: 30px;
      }
      .mg-t-50{
        margin-top:50px;
      }
      .pd-lr-20{
        padding-left:20px;
        padding-right: 20px;
      }
      .pd-tb-13{
        padding-top:13px;
        padding-bottom:13px;
      }
      .pd-lr-30{
        padding-left:30px;
        padding-right: 30px;
      }
      .pd-t-20{
        padding-top:20px;
      }
      .pd-all-20{
        padding:20px;
      }
      .lh60{
        height:60px;
        line-height:60px;
      }
      .content{
        height:40px;
        line-height:40px;
        background: #F4F6FA;
        margin-bottom: 1px;
      }
      .bg-content{
        height:40px;
        line-height:40px;
        background: #F4F6FA;
        margin:0;
      }

      .fz-18{
        font-size: 18px;
      }
      .fz-14{
        font-size: 14px;
      }
      .fz-16{
        font-size: 16px;
      }
      .color-default{
        color:#333333;
      }
      .color-theme{
        color: #4678fa;
      }
      .radius{
        border-radius: 6px;
      }
      .cur-hand{
        cursor: pointer;
      }
      .disflex{
        display: -webkit-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: -moz-box;
        display: flex;
      }
      .justify-space{
        justify-content: space-between;
      }
      .justify-end{
        justify-content: flex-end;
      }
      .font-bold{
        font-weight: bold;
      }
      .lh40{
        height: 40px;
        line-height: 40px;
      }
      p{
        margin-bottom:0;
      }
      .border-bottom{
        border-bottom:1px solid #EBEEF2;
      }
      .form-control:focus {
        border: 2px solid #DADFE6 !important;
        box-shadow: none;
      }
  
      input[type=number] {
        -moz-appearance: textfield;
      }
      input[type=number]::-webkit-inner-spin-button,
      input[type=number]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      
      input:focus {
        border: none !important;
        box-shadow: none;
        outline: 0;
      }
      .p_small{
        line-height:22px;
      }
      .pos-r{
        position:relative;
      }
      .pos-a{
        position: absolute;
      }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RechargePayPage implements OnInit,OnDestroy{

  private viewDataSub: any;
  private paramsSub: any;
  private service: RechargePayService;
  public viewData: RechargePayViewData;

  constructor(private orderDetailMgr:OrderDetailMgr,
              private leaguerDetailMgr:LeaguerDetailMgr,
              private orderViewDataMgr:OrderViewDataMgr,
              private matDialog: MatDialog,
              private cdRef: ChangeDetectorRef,
              private route: ActivatedRoute){
    ZmModalMgr.getInstance().reset(matDialog);
    this.service = new RechargePayService(this.orderDetailMgr,this.leaguerDetailMgr,this.orderViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.orderViewDataMgr.subscribeRechargePayVD((viewDataP: RechargePayViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.paramsSub = this.route.params.subscribe(params => {
      let orderId = params["orderId"];
      this.service.initViewData(orderId);
    })

  }

  ngOnDestroy(): void {
    if (!AppUtils.isNullObj(this.viewDataSub)) {
      this.viewDataSub.unsubscribe();
    }
  }

  /**
   * 刷新
   */
  refresh(){
    this.service.initViewData(this.viewData.orderDetail.simpleOrderInfo.orderId);
  }

  /**
   * 收款回调
   */
  payCallback(){
    AppUtils.showSuccess("提示","收款成功");
    this.viewData.hasPay = true;
    AppRouter.goOrderRechargeDetail(this.viewData.orderDetail.simpleOrderInfo.orderId);
  }

  /**
   * 显示未完成付款弹框
   */
  showUnPayPopup(){
    return new Promise<boolean>(resolve=>{
      const activeModal = ZmModalMgr.getInstance().newStaticSmallModal(UnPayPopup,null,null);
      activeModal.componentInstance.action = (result)=>{
        resolve(result);
      }
    })
  }

}

class RechargePayService{
  constructor(private orderDetailMgr:OrderDetailMgr,
              private leaguerDetailMgr:LeaguerDetailMgr,
              private orderViewDataMgr:OrderViewDataMgr,){}

  public initViewData(orderId): void {
    let viewDataTmp = new RechargePayViewData();
    this.orderViewDataMgr.setRechargePayViewData(viewDataTmp);

    this.buildViewData(orderId);
  }

  public async buildViewData(orderId) {
    let viewDataTmp = new RechargePayViewData();

    let orderDetail:OrderDetail = await this.orderDetailMgr.getOrderDetail(orderId);
    if(!AppUtils.isNullObj(orderDetail)){
      viewDataTmp.orderDetail = orderDetail;
      //会员卡余额 是否散客
      let leaguerDetail = await this.leaguerDetailMgr.get(orderDetail.simpleLeaguerInfo.id);
      viewDataTmp.balance = AppUtils.appendZero(leaguerDetail?leaguerDetail.leaguerMemberCard.balance:0);
      viewDataTmp.clearPayList();
      //实收、赠送、实充
      if(orderDetail.rechargeDetails && orderDetail.rechargeDetails[0]){
        viewDataTmp.pay = AppUtils.roundPoint(orderDetail.rechargeDetails[0].pay,2);
        viewDataTmp.largess = AppUtils.roundPoint(orderDetail.rechargeDetails[0].largess,2);
        viewDataTmp.amount = AppUtils.roundPoint(orderDetail.rechargeDetails[0].amount,2);
      }
      viewDataTmp.orderCost = AppUtils.appendZero(viewDataTmp.pay);
      //实收可修改
      viewDataTmp.orderPay = AppUtils.appendZero(viewDataTmp.pay);
      //已支付信息
      if(!AppUtils.isNullObj(orderDetail.payItems)){
        for(let i=0;i<orderDetail.payItems.length;i++){
          let payItem = orderDetail.payItems[i];
          for(let j=0;j<viewDataTmp.payList.length;j++){
            let payItemData = viewDataTmp.payList[j];
            if(payItemData.payType == payItem.payType){
              payItemData.outTradeNo = payItem.outTradeNo;
              payItemData.value = payItem.cost;
              payItemData.isSelect = true;
              payItemData.canEdit = false;
            }
          }
        }
      }
      //支付状态
      viewDataTmp.hasPay = orderDetail.simpleOrderInfo.status == OrderStatusEnum.NOT_PAY?false:true;
      viewDataTmp.payCompData = PayCompViewData.fromRechargePay(viewDataTmp);
    }
    this.orderViewDataMgr.setRechargePayViewData(viewDataTmp);
  }

}

export class RechargePayViewData{
  public orderDetail: OrderDetail = new OrderDetail();//订单详情
  public pay:number;// 应收
  public largess:number;//赠送
  public amount:number;// 实充

  public payList:Array<PayItemData> = new Array<PayItemData>();//支付信息
  public remark:string;//备注信息

  public balance:number = 0;//会员卡余额

  public orderCost:number;//订单应结
  public orderPay:number = 0;//实际应收 可修改
  public restAmount:number = 0;//还需支付

  public payCompData:PayCompViewData;//支付组件数据

  public hasPay:boolean = false;//是否已经支付

  constructor(){}

  public clearPayList(){
    this.payList = new Array<PayItemData>();
    this.payList.push(new PayItemData(PayTypeEnum.ALIPAY));
    this.payList.push(new PayItemData(PayTypeEnum.ARREARAGE));
    this.payList.push(new PayItemData(PayTypeEnum.CASH));
    this.payList.push(new PayItemData(PayTypeEnum.SLOT_CARD));
    this.payList.push(new PayItemData(PayTypeEnum.WECHAT));
    this.remark = undefined;
  }
}
