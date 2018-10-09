import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from "@angular/core";
import {AppUtils} from "../../../../comModule/AppUtils";
import {PayItemData} from "../../../zmComp/form/zmPay/PayItemData";
import {PayTypeEnum} from "../../../../bsModule/order/data/PayTypeEnum";
import {Order} from "../../../../bsModule/order/data/Order";
import {PayOrderWithNoteApiForm} from "../../../../bsModule/order/apiData/PayOrderWithNoteApiForm";
import {PayItem} from "../../../../bsModule/order/data/PayItem";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {OrderMgr} from "../../../../bsModule/order/OrderMgr";
import {PayCompViewData} from "./payCompViewData";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../../zmComp/modal/ZmModalMgr";
import {RestResp} from "../../../../comModule/RestResp";

/**
 * 支付收款信息组件
 */
@Component({
  selector: 'pay-comp',
  template: `

       <zm-card-box [withCollapse]="false" [expanded]="true">
           <header  style="width: 100%">
               <div fxLayou="row" fxLayoutAlign="space-between center">
                    <span class="fz-18 color-default">支付</span> 
                    <div fxLayou="row" fxLayoutAlign="start center" fxLayoutGap="2px">
                        <span style="font-size:12px;">支付异常</span>
                        <img title="若在使用微信或支付宝支付过程中出现支付异常\n可点击下方的【刷新支付状态】查询支付结果。" src="assets/images/icon/question.png">
                    </div>
               </div>
           </header>
           <content  fxLayout="column" fxLayoutGap="30px" style="padding-left:15px;">
           
                  <div class="border-bottom" style="padding-bottom: 15px;" fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="20px">
                    <div class="fz-18 color-default w-25-p">实收</div>
                    <div class="fz-14" style="font-weight: normal;color:#333; position:relative;padding:10px 20px;border:2px solid #E7EAEF;border-radius:6px;" >
                      <span style="position:absolute;left:5px;top:10px;">￥</span>
                      <input  matInput style="" type="number" oninput="if(value<0 || value>99999999)value=null" class="mg-l-25" [(ngModel)]="viewData.orderPay" (blur)="changeOrderPay($event)"/>
                    </div>
                  </div>
                  
                  <div class="border-bottom"  fxLayout="row" fxLayoutAlign="start start" fxLayoutGap="20px">
                    <div class="fz-18 color-default w-25-p">支付方式</div>
                    <div class="w-70-p">
                     <zm-pay-type [(payList)]="viewData.payList" [restAmount]="getRestAmount()" (callback)="changePayAmount()"></zm-pay-type>
                    </div>
                   
                  </div>
                  
                  <div class="border-bottom" *ngIf="checkHas()">

                    <zm-pay-input [orderId]="viewData.orderId?viewData.orderId:'0'" 
                    [balance]="viewData.balance" [(payList)]="viewData.payList" 
                    (callback)="changePayAmount()"></zm-pay-input>
                  </div>
                  
                  <div fxLayout="row" fxLayoutGap="20px">
                    <span class="w-25-p fz-18 color-default">还需支付</span>
                    <span class="fz-14 color-theme">￥</span><span class="fz-18 color-theme">{{getRestAmount() | number:'1.2-2'}}</span>
                  </div>
                  <zm-input-textarea [label]="'订单备注'" [placeholder]="'非必填'" [(text)]="viewData.remark"></zm-input-textarea>
                  
                <div fxLayout="row" fxLayoutAlign="end" fxLayoutGap="20px" style="padding-right:10px">
                        <zm-btn-md stroked="true" name="刷新支付状态" (zmbtnClick)="refresh()"></zm-btn-md>
                        <zm-btn-md name="收款" (zmbtnClick)="confirmPay()"></zm-btn-md>
                  </div>
          
          
          
           </content>
       </zm-card-box>
  `,
  styles: [`
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
})
export class PayComp implements OnInit,OnDestroy {

  @Input() viewData: PayCompViewData;
  @Output() callback: EventEmitter<any> = new EventEmitter<any>();
  @Output() refreshCallback: EventEmitter<any> = new EventEmitter<any>();
  private service: PayCompService;

  constructor(private orderMgr: OrderMgr, private matDialog: MatDialog) {
    ZmModalMgr.getInstance().reset(matDialog);
    this.service = new PayCompService(this.orderMgr);
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }

  /**
   * 刷新订单支付信息
   */
  refresh() {
    this.refreshCallback.emit();
  }

  /**
   * 修改实际应收
   * @param e
   */
  changeOrderPay(e) {
    let pay = e.target.value;
    pay = pay ? pay : this.viewData.orderCost;
    pay = pay > 0 ? pay : this.viewData.orderCost;
    pay = AppUtils.roundPoint(pay, 2);
    this.viewData.orderPay = AppUtils.appendZero(pay);
  }

  /**
   * 是否已选择支付方式
   * @returns {boolean}
   */
  checkHas(): boolean {
    let has: boolean = false;
    for (let i = 0; i < this.viewData.payList.length; i++) {
      let payItem = this.viewData.payList[i];
      if (payItem.isSelect) {
        has = true;
        break;
      }
    }
    return has;
  }

  /**
   * 页面点击事件 计算应收
   */
  changePayAmount() {
    let hasPayAmount = 0;
    this.viewData.payList.forEach((item: PayItemData) => {
      if (item.isSelect && !AppUtils.isNullObj(item.value)) {
        hasPayAmount = hasPayAmount + parseFloat(item.value.toString());
      }
    })
    this.viewData.restAmount = AppUtils.appendZero((this.viewData.orderPay - hasPayAmount));
  }

  /**
   * 获取剩余应付
   */
  getRestAmount(): number {
    let hasPayAmount = 0;
    this.viewData.payList.forEach((item: PayItemData) => {
      if (item.isSelect && !AppUtils.isNullObj(item.value)) {
        hasPayAmount = hasPayAmount + parseFloat(item.value.toString());
      }
    })
    this.viewData.restAmount = AppUtils.appendZero((this.viewData.orderPay - hasPayAmount));
    return this.viewData.restAmount;
  }

  /**
   * 确认付款
   */
  confirmPay(): void {
    if (!this.checkMemberCardAmount()) {
      AppUtils.showWarn("提示", "卡扣金额不得超过会员卡余额");
    }
    else if (!this.checkAmount()) {
      AppUtils.showWarn("提示", "实付与应结金额不符，请检查金额输入");
    }
    else if ((this.viewData.orderCost != 0) && this.checkPay()) {
      AppUtils.showWarn("提示", "请检查金额输入");
    } else {
      if ((this.viewData.orderCost == 0) && this.checkPay()) {
        for (let i = 0; i < this.viewData.payList.length; i++) {
          let payItem = this.viewData.payList[i];
          if (payItem.payType == PayTypeEnum.CASH) {
            payItem.isSelect = true;
            payItem.value = 0;
            break;
          }
        }
      }
      this.payOrder();
    }
  }

  /**
   * 支付订单
   */
  private payOrder() {
    if (this.viewData.payList.length > 0) {
      AppUtils.showMask("结算中");//遮罩
      let orderId = this.viewData.orderId;

      this.orderMgr.get(orderId).then((order: Order) =>{
        if (!AppUtils.isNullObj(order)) {
          this.service.payOrderWithNote(order, this.viewData.payList, this.viewData.remark).then((restResp: RestResp) => {
            AppUtils.closeMask();
            if (restResp.code == 200) {
              this.callback.emit();
            } else {
              AppUtils.showError("提示", restResp.tips);
            }
          })
        }else{
          AppUtils.showError("提示", "请求失败");
        }
      })
    } else {
      AppUtils.showWarn("提示", "请选择支付方式");
    }
  }

  /**
   * 检查卡扣金额是否相符
   */
  checkMemberCardAmount(): boolean {
    let success: boolean = true;
    for (let i = 0; i < this.viewData.payList.length; i++) {
      let payItem = this.viewData.payList[i];
      if ((payItem.payType == PayTypeEnum.MEMBERSHIPCARD) && payItem.isSelect && !AppUtils.isNullObj(payItem.value)) {
        if (parseFloat(payItem.value.toString()) > parseFloat(this.viewData.balance.toString())) {
          success = false;
          break;
        }
      }
    }
    return success;
  }

  /**
   * 检查支付金额是否相符
   * @returns {boolean}
   */
  checkAmount(): boolean {
    if (this.viewData.restAmount == 0) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * 检查是否输入支付金额 true
   * @returns {boolean}
   */
  checkPay(): boolean {
    let success: boolean = true;
    for (let i = 0; i < this.viewData.payList.length; i++) {
      let payItem = this.viewData.payList[i];
      if (!AppUtils.isNullObj(payItem.value)) {
        success = false;
        break;
      }
    }
    return success;
  }

}

class PayCompService {

  constructor(private orderMgr: OrderMgr,) {
  }

  /**
   * 支付订单
   * @param order
   * @param payList
   * @param remark
   */
  public payOrderWithNote(order: Order, payList: Array<PayItemData>, remark: string): Promise<RestResp> {
    let storeId = SessionUtil.getInstance().getStoreId();
    // 覆盖支付信息
    let payItemMap = order.getPayItemMap();
    let payItems = new Array<PayItem>();
    payList.forEach((item: PayItemData) => {
      if (item.isSelect && !AppUtils.isNullObj(item.value)) {
        let payItemTmp = payItemMap.get(this.getPayItemKey(item.payType, item.outTradeNo));
        if (payItemTmp) {
          payItems.push(payItemTmp);
        } else {
          let payItem = new PayItem();
          payItem.payType = item.payType;
          payItem.cost = item.value;
          payItems.push(payItem);
        }
      }
    })
    let payOrderWithNoteApiForm = new PayOrderWithNoteApiForm();
    payOrderWithNoteApiForm.payItems = payItems;
    payOrderWithNoteApiForm.remark = remark;
    return this.orderMgr.payOrderWithNote(storeId, order.id, payOrderWithNoteApiForm);
  }

  /**
   * 支付项key payType_outTradeNo
   * @param payItem
   * @returns {string}
   */
  private getPayItemKey(payType: number, outTradeNo: string): string {
    return AppUtils.format('{0}_{1}', payType.toString(), outTradeNo);
  }

}


