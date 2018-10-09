import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy} from "@angular/core";
import {AppUtils} from "../../../comModule/AppUtils";
import {ActivatedRoute} from "@angular/router";
import {OrderViewDataMgr} from "../orderViewDataMgr";
import {OrderDetailMgr} from "../../../bsModule/orderDetail/OrderDetailMgr";
import {OrderDetail} from "../../../bsModule/orderDetail/data/OrderDetail";
import {PayItemData} from "../../zmComp/form/zmPay/PayItemData";
import {PayTypeEnum} from "../../../bsModule/order/data/PayTypeEnum";
import {BuyDetail} from "../../../bsModule/orderDetail/data/BuyDetail";
import {BuyTypeEnum} from "../../../bsModule/order/data/BuyTypeEnum";
import {Constants} from "../../common/Util/Constants";
import {AppRouter} from "../../../comModule/AppRouter";
import {PayCompViewData} from "./payComp/payCompViewData";
import {LeaguerDetailMgr} from "../../../bsModule/leaguerDetail/LeaguerDetailMgr";
import {UnPayPopup} from "./unPayPopup";
import {OrderStatusEnum} from "../../../bsModule/order/data/OrderStatusEnum";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";
import {PaySucceedPopup, PaySucceedPopupActionIndex} from "./paySucceedPopup/paySucceedPopup";

/**
 * 支付收款页面
 */
@Component({
  selector:'consume-pay',
  template:`

       <div animation-modal role="pay" class="disflex" style="background: #EBEFF5;padding:10px;min-height:100%;overflow-y: scroll;">
         
        <!--购买信息-->
        <div style="margin-right:20px; width:45%; flex-shrink: 0;">
          
          <div class="bgc mg-b-12 radius pd-lr-20 pd-tb-13">
            <p class="title color-default font-bold lh40">合计</p>
            <p class="content disflex justify-space pd-lr-20 fz-14"><span>总价</span><span>&yen; {{viewData.orderAmount | number:'1.2-2'}}</span></p>
            <p class="content disflex justify-space pd-lr-20 fz-14"><span>折扣</span><span>&yen; {{viewData.disAmount == 0?(viewData.disAmount | number:'1.2-2'):("-"+(viewData.disAmount | number:'1.2-2'))}}</span></p>
            <p class="content disflex justify-space pd-lr-20 fz-14"><span>应收</span><span>&yen; {{viewData.orderCost | number:'1.2-2'}}</span></p>
          </div>
          
          <div class="bgc mg-b-12 radius pd-lr-20 pd-tb-13" *ngIf="viewData.orderDetail.delimitCardDetails&&viewData.orderDetail.delimitCardDetails.length>0">
            <p class="title color-default font-bold lh40">划卡</p>
            <p class="content disflex justify-space pd-lr-20 fz-14" *ngFor="let item of viewData.orderDetail.delimitCardDetails"><span>{{item.pgName}}</span><span>x{{item.count}}</span></p>
          </div>
          
          <div class="bgc mg-b-12 radius pd-tb-13" *ngIf="viewData.orderDetail.buyDetails&&viewData.orderDetail.buyDetails.length>0">
            <p class="title color-default font-bold lh40 pd-lr-20 border-bottom">购买</p>
            <div class="pd-lr-20" *ngIf="viewData.productList.length>0">
              <p class="lh40 color-default fz-14">项目</p>
              <div class="content disflex justify-space pd-lr-20 fz-14 pos-r" *ngFor="let item of viewData.productList">
                <span>{{item.pgName}}</span>
                <div class="w-50-p" fxLayout="row" fxLayoutAlign="space-between center">
                  <span class="disflex" style="flex-direction: column;" >x{{item.count}}</span>
                  <span class="disflex" style="flex-direction: column;">
                    <span [class.p_small]="item.oldPrice!=item.price">￥{{item.price}}</span>
                    <s *ngIf="item.oldPrice!=item.price" style="font-size: 10px;color: #9C9C9C;line-height: 18px;text-align: right;">￥{{item.oldPrice}}</s>
                  </span>
                </div>
              </div>
            </div>
            
            <div class="pd-lr-20" *ngIf="viewData.goodsList.length>0">
              <p class="lh40 color-default fz-14">商品</p>
              <div class="content disflex justify-space pd-lr-20 fz-14 pos-r" *ngFor="let item of viewData.goodsList">
                <span>{{item.pgName}}</span>
                <div class="w-50-p" fxLayout="row" fxLayoutAlign="space-between center">
                    <span class="disflex" style="flex-direction: column;">x{{item.count}}</span>
                    <span class="disflex" style="flex-direction: column;">
                      <span [class.p_small]="item.oldPrice!=item.price">￥{{item.price}}</span>
                      <s *ngIf="item.oldPrice!=item.price" style="font-size: 10px;color: #9C9C9C;line-height: 18px;text-align: right;">￥{{item.oldPrice}}</s>
                    </span>
                </div>    
              </div>
            </div>
            <div class="pd-lr-20" *ngIf="viewData.cardList.length>0">
              <p class="lh40 color-default fz-14">次卡</p>
              <div class="content disflex justify-space pd-lr-20 fz-14 pos-r" *ngFor="let item of viewData.cardList">
                <span>{{item.pgName}}</span>
                <div class="w-50-p" fxLayout="row" fxLayoutAlign="space-between center">
                    <span class="disflex" style="flex-direction: column;">x{{item.count}}</span>
                    <span class="disflex" style="flex-direction: column;">
                      <span [class.p_small]="item.oldPrice!=item.price">￥{{item.price}}</span>
                      <s *ngIf="item.oldPrice!=item.price" style="font-size: 10px;color: #9C9C9C;line-height: 18px;text-align: right;">￥{{item.oldPrice}}</s>
                    </span>
                </div>    
              </div>
            </div>
            <div class="pd-lr-20" *ngIf="viewData.packageList.length>0">
              <p class="lh40 color-default fz-14">套餐</p>
              <div class="content disflex justify-space pd-lr-20 fz-14 pos-r" *ngFor="let item of viewData.packageList">
                <span>{{item.pgName}}</span>
                <div class="w-50-p" fxLayout="row" fxLayoutAlign="space-between center">
                    <span class="disflex" style="flex-direction: column;">x{{item.count}}</span>
                    <span class="disflex" style="flex-direction: column;">
                      <span [class.p_small]="item.oldPrice!=item.price">￥{{item.price}}</span>
                      <s *ngIf="item.oldPrice!=item.price" style="font-size: 10px;color: #9C9C9C;line-height: 18px;text-align: right;">￥{{item.oldPrice}}</s>
                    </span>
                </div>    
              </div>
            </div>
          </div>
          
          <div class="bgc radius pd-lr-20 pd-tb-13" *ngIf="viewData.orderDetail.donateDetails&&viewData.orderDetail.donateDetails.length>0">
            <p class="title color-default font-bold lh40">赠送</p>
            <p class="content disflex justify-space pd-lr-20 fz-14" *ngFor="let item of viewData.orderDetail.donateDetails"><span>{{item.pgName}}</span><span>x{{item.count}}</span></p>
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
        margin-bottom: 0px;
        
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
export class ConsumePayPage implements OnInit,OnDestroy{

  private viewDataSub: any;
  private paramsSub: any;
  private service: ConsumePayService;
  public viewData: ConsumePayViewData;

  constructor(private orderDetailMgr:OrderDetailMgr,
              private leaguerDetailMgr:LeaguerDetailMgr,
              private orderViewDataMgr:OrderViewDataMgr,
              private matDialog: MatDialog,
              private cdRef: ChangeDetectorRef,
              private route: ActivatedRoute){
    ZmModalMgr.getInstance().reset(matDialog);
    this.service = new ConsumePayService(this.orderDetailMgr,this.leaguerDetailMgr,this.orderViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.orderViewDataMgr.subscribeConsumePayVD((viewDataP: ConsumePayViewData) => {
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
    this.viewData.hasPay = true;
    const activeModal = ZmModalMgr.getInstance().newStaticSmallModal(PaySucceedPopup,null,null);
    activeModal.componentInstance.action = (index)=>{
      if (index == PaySucceedPopupActionIndex.APPOINT){
        //去预约
        let split = this.viewData.orderDetail.simpleLeaguerInfo.id.split("_");
        if((split[1] == Constants.LEAGUER_MALE_SUFFIX) || (split[1] == Constants.LEAGUER_FEMALE_SUFFIX)){
          AppRouter.goAddAppointmentByLeaguer(0);
        }else{
          AppRouter.goAddAppointmentByLeaguer(this.viewData.orderDetail.simpleLeaguerInfo.id);
        }

      } else if (index == PaySucceedPopupActionIndex.EXIT) {
        //离开  去详情
        AppRouter.goOrderConsumeDetail(this.viewData.orderDetail.simpleOrderInfo.orderId);
      }
    };
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

class ConsumePayService{
  constructor(private orderDetailMgr:OrderDetailMgr,
              private leaguerDetailMgr:LeaguerDetailMgr,
              private orderViewDataMgr:OrderViewDataMgr,){}

  public initViewData(orderId): void {
    let viewDataTmp = new ConsumePayViewData();
    this.orderViewDataMgr.setConsumePayViewData(viewDataTmp);

    this.buildViewData(orderId);
  }

  public async buildViewData(orderId) {
    let viewDataTmp = new ConsumePayViewData();

    let orderDetail:OrderDetail = await this.orderDetailMgr.getOrderDetail(orderId);
    if(!AppUtils.isNullObj(orderDetail)){
      viewDataTmp.orderDetail = orderDetail;
      //会员卡余额 是否散客
      let leaguerDetail = await this.leaguerDetailMgr.get(orderDetail.simpleLeaguerInfo.id);
      viewDataTmp.balance = AppUtils.appendZero(leaguerDetail?leaguerDetail.leaguerMemberCard.balance:0);
      viewDataTmp.isLeaguer = this.getIsLeaguer(orderDetail.simpleLeaguerInfo.id);
      viewDataTmp.clearPayList();
      //总价、折扣、应结
      viewDataTmp.orderAmount = AppUtils.roundPoint(orderDetail.simpleOrderInfo.cost,2);
      if(orderDetail.buyDetails){
        orderDetail.buyDetails.forEach((item:BuyDetail)=>{
          viewDataTmp.orderCost = viewDataTmp.orderCost + parseFloat(item.pay.toString());
          viewDataTmp.orderCost = AppUtils.roundPoint(viewDataTmp.orderCost,2);
        });
      }
      viewDataTmp.disAmount = AppUtils.roundPoint(viewDataTmp.orderAmount - viewDataTmp.orderCost,2);
      //购买信息
      if(orderDetail.buyDetails){
        orderDetail.buyDetails.forEach((item:BuyDetail)=>{
          if(item.buyType == BuyTypeEnum.PRODUCT){
            viewDataTmp.productList.push(item);
          }else if(item.buyType == BuyTypeEnum.GOODS){
            viewDataTmp.goodsList.push(item);
          }else if(item.buyType == BuyTypeEnum.PACKAGE){
            viewDataTmp.packageList.push(item);
          }else if(item.buyType == BuyTypeEnum.PRDCARD){
            viewDataTmp.cardList.push(item);
          }
        })
      }
      //实收
      viewDataTmp.orderPay = AppUtils.appendZero(viewDataTmp.orderCost);
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
      viewDataTmp.payCompData = PayCompViewData.fromConsumePay(viewDataTmp);
    }
    this.orderViewDataMgr.setConsumePayViewData(viewDataTmp);
  }

  /**
   * 判断是否是会员会员
   * @param leaguerId
   * @returns {boolean}
   */
  private getIsLeaguer(leaguerId):boolean{
    let isLeaguer = true;
    let split = leaguerId.split("_");
    if((split[1] == Constants.LEAGUER_MALE_SUFFIX) || (split[1] == Constants.LEAGUER_FEMALE_SUFFIX)){
      isLeaguer = false;
    }
    return isLeaguer;
  }

}

export class ConsumePayViewData{
  public orderDetail: OrderDetail = new OrderDetail();//订单详情
  public productList:Array<BuyDetail> = new Array<BuyDetail>();//购买项目列表
  public goodsList:Array<BuyDetail> = new Array<BuyDetail>();//购买商品列表
  public packageList:Array<BuyDetail> = new Array<BuyDetail>();//购买套餐列表
  public cardList:Array<BuyDetail> = new Array<BuyDetail>();//购买次卡列表

  public orderAmount: number = 0;//总价
  public disAmount:number = 0;//折扣
  public orderCost:number = 0;//应结

  public payList:Array<PayItemData> = new Array<PayItemData>();//支付信息
  public remark:string;//备注信息

  public isLeaguer:boolean = true;//是否是会员
  public balance:number = 0;//会员卡余额

  public orderPay:number = 0;//实际应收 可修改
  public restAmount:number = 0;//还需支付

  public payCompData:PayCompViewData;//支付组件数据

  public hasPay:boolean = false;//是否已经支付

  constructor(){}

  public clearPayList(){
    if(!this.isLeaguer){
      this.payList = new Array<PayItemData>();
      this.payList.push(new PayItemData(PayTypeEnum.ALIPAY));
      this.payList.push(new PayItemData(PayTypeEnum.CASH));
      this.payList.push(new PayItemData(PayTypeEnum.SLOT_CARD));
      this.payList.push(new PayItemData(PayTypeEnum.WECHAT));
      this.remark = undefined;
    }else{
      this.payList = new Array<PayItemData>();
      this.payList.push(new PayItemData(PayTypeEnum.ALIPAY));
      this.payList.push(new PayItemData(PayTypeEnum.ARREARAGE));
      this.payList.push(new PayItemData(PayTypeEnum.CASH));
      this.payList.push(new PayItemData(PayTypeEnum.MEMBERSHIPCARD));
      this.payList.push(new PayItemData(PayTypeEnum.SLOT_CARD));
      this.payList.push(new PayItemData(PayTypeEnum.WECHAT));
      this.remark = undefined;
    }
  }
}
