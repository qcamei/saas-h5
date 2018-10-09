import {Component, Input, Output, OnInit, Inject} from "@angular/core";

import {AppUtils} from "../../../../comModule/AppUtils";
import {OrderWFCompData, BillItemData} from "../../wfComp/WFDataWraper";
import {BuyTypeEnum} from "../../../../bsModule/order/data/BuyTypeEnum";
import {PayTypeEnum} from "../../../../bsModule/order/data/PayTypeEnum";
import {PayItemData} from "../../../zmComp/form/zmPay/PayItemData";
import {MAT_DIALOG_DATA} from "@angular/material";

/**
 * 开单收银结算单公共组件
 */
@Component({
  selector:'order-new-popup',
  template:`

       <div animation-modal role="pay" class="disflex" style="background: #EBEFF5;padding:10px;min-height:100%;overflow-y: scroll;">
       
        <div style="margin-right:20px; width:45%; flex-shrink: 0;">
          <div class="lh60 bgc mg-b-12 fz-18 color-default radius pd-lr-20 cur-hand" (click)="closeModal()">
           <span class="mg-r-5" style="font-size: 22px;color: #9a9a9a;">&lt;</span><span>返回</span>
          </div>
          
          <div class="bgc mg-b-12 radius pd-lr-20 pd-tb-13">
            <p class="title color-default font-bold lh40">合计</p>
            <p class="content disflex justify-space pd-lr-20 fz-14"><span>总价</span><span>&yen; {{data.orderAmount | number:'1.2-2'}}</span></p>
            <p class="content disflex justify-space pd-lr-20 fz-14"><span>折扣</span><span>&yen; {{data.disAmount == 0?(data.disAmount | number:'1.2-2'):("-"+(data.disAmount | number:'1.2-2'))}}</span></p>
            <p class="content disflex justify-space pd-lr-20 fz-14"><span>应收</span><span>&yen; {{data.orderCost | number:'1.2-2'}}</span></p>
          </div>
          
          <div class="bgc mg-b-12 radius pd-lr-20 pd-tb-13" *ngIf="data.reduceList.length>0">
            <p class="title color-default font-bold lh40">划卡</p>
            <p class="content disflex justify-space pd-lr-20 fz-14" *ngFor="let item of data.reduceList"><span>{{item.name}}</span><span>x{{item.count}}</span></p>
          </div>
          
          <div class="bgc mg-b-12 radius pd-tb-13" *ngIf="data.billList.length>0">
            <p class="title color-default font-bold lh40 pd-lr-20 border-bottom">购买</p>
            
            <div class="pd-lr-20" *ngIf="productList.length>0"><!--这里开始消费循环6666666-->
              <p class="lh40 color-default fz-14">项目</p>
              <p class="content disflex justify-space pd-lr-20 fz-14 pos-r" *ngFor="let item of productList">
                <span>{{item.name}}</span>
                <span class="pos-a" style="left:380px;">x{{item.count}}</span>
                <span class="disflex" style="flex-direction: column;">
                  <span [class.p_small]="item.oldPrice!=item.price">￥{{item.price}}</span>
                  <s *ngIf="item.oldPrice!=item.price" style="font-size: 10px;color: #9C9C9C;line-height: 18px;text-align: right;">￥{{item.oldPrice}}</s>
                </span>
              </p>
            </div>
            
            <div class="pd-lr-20" *ngIf="goodsList.length>0"><!--这里开始消费循环6666666-->
              <p class="lh40 color-default fz-14">商品</p>
              <p class="content disflex justify-space pd-lr-20 fz-14 pos-r" *ngFor="let item of goodsList">
                <span>{{item.name}}</span>
                <span class="pos-a" style="left:380px;">x{{item.count}}</span>
                <span class="disflex" style="flex-direction: column;">
                  <span [class.p_small]="item.oldPrice!=item.price">￥{{item.price}}</span>
                  <s *ngIf="item.oldPrice!=item.price" style="font-size: 10px;color: #9C9C9C;line-height: 18px;text-align: right;">￥{{item.oldPrice}}</s>
                </span>
              </p>
            </div>
            <div class="pd-lr-20" *ngIf="cardList.length>0"><!--这里开始消费循环6666666-->
              <p class="lh40 color-default fz-14">次卡</p>
              <p class="content disflex justify-space pd-lr-20 fz-14 pos-r" *ngFor="let item of cardList">
                <span>{{item.name}}</span>
                <span  class="pos-a" style="left:380px;">x{{item.count}}</span>
                <span class="disflex" style="flex-direction: column;">
                  <span [class.p_small]="item.oldPrice!=item.price">￥{{item.price}}</span>
                  <s *ngIf="item.oldPrice!=item.price" style="font-size: 10px;color: #9C9C9C;line-height: 18px;text-align: right;">￥{{item.oldPrice}}</s>
                </span>
              </p>
            </div>
            <div class="pd-lr-20" *ngIf="packageList.length>0"><!--这里开始消费循环6666666-->
              <p class="lh40 color-default fz-14">套餐</p>
              <p class="content disflex justify-space pd-lr-20 fz-14 pos-r" *ngFor="let item of packageList">
                <span>{{item.name}}</span>
                <span class="pos-a" style="left:380px;">x{{item.count}}</span>
                <span class="disflex" style="flex-direction: column;">
                  <span [class.p_small]="item.oldPrice!=item.price">￥{{item.price}}</span>
                  <s *ngIf="item.oldPrice!=item.price" style="font-size: 10px;color: #9C9C9C;line-height: 18px;text-align: right;">￥{{item.oldPrice}}</s>
                </span>
              </p>
            </div>
          </div>
          
          <div class="bgc radius pd-lr-20 pd-tb-13" *ngIf="data.giftList.length>0">
            <p class="title color-default font-bold lh40">赠送</p>
            <p class="content disflex justify-space pd-lr-20 fz-14" *ngFor="let item of data.giftList"><span>{{item.name}}</span><span>x{{item.count}}</span></p>
          </div>
        
        </div>  
        <div style="width:53%; flex-shrink: 0;">
            <div class="radius bgc" style="padding-bottom:20px;min-height:100%;">
              <div class="lh60 fz-18 font-bold color-default pd-lr-20 border-bottom">支付</div>
              
              <div class="font-bold pd-lr-30 border-bottom disflex pay">
                <span class="fz-18 color-default" style="flex-shrink:0;margin-left:15px;">实收</span>
                <div class="fz-14 disflex form-control" style="font-weight: normal;margin-left:120px;border:2px solid #E7EAEF;border-radius:6px;max-width:40%;color:#333;">
                  <span style="padding:6px 0;">￥</span>
                  <input style="border:none; flex-grow:1;" type="number" class="mg-l-25" [(ngModel)]="orderPay" (blur)="changeOrderPay($event)"/>
                </div>
                <!--<span class="fz-18 color-theme">{{payAmount | number:'1.2-2'}}</span>-->
                
              </div>
              
              <div class="font-bold pd-all-20 border-bottom disflex">
                <span class="fz-18 color-default pd-lr-30 " style="flex-shrink:0;">支付方式</span>
                <div style="margin-left:50px;">
                  <zm-pay-type [(payList)]="data.payList" [restAmount]="restAmount" (callback)="changePayAmount()"></zm-pay-type>
                </div>
              </div>
              
              <div class="pd-lr-30 border-bottom pd-t-20" *ngIf="checkHas()">
                <zm-pay-input [orderId]="data.order?data.order.id:'0'" [balance]="data.balance" [(payList)]="data.payList" (callback)="changePayAmount()"></zm-pay-input>
              </div>
              
              <div class="lh60 font-bold pd-lr-20">
                <span class="fz-18 color-default pd-lr-30">还需支付</span>
                <span class="fz-14 color-theme" style="margin-left:45px;">￥</span><span class="fz-18 color-theme">{{restAmount | number:'1.2-2'}}</span>
              </div>
              
              <div class="font-bold pd-lr-20 " >
                 <p class="lh60 fz-18 color-default pd-lr-30">订单备注</p>
                 <textarea [name]="'mark'" maxlength="200" class="form-control mg-lr-30" style="width:92%;" [placeholder]="'非必填'" [(ngModel)]="data.remark"></textarea>
              </div>
              
              <!--<div class="lh60 font-bold pd-lr-20 d-flex">-->
                <!--<span class="fz-18 color-default pd-lr-30">转入预存</span>-->
                <!--<div style="margin-top:18px;">-->
                  <!--<switch-button-comp [(state)]="a"></switch-button-comp>-->
                <!--</div>-->
              <!--</div>-->

              <zm-btn-md class="disflex mg-t-50 justify-end" style="margin-left:50px;margin-right: 50px;" name="收款" (zmbtnClick)="confirm()"></zm-btn-md>
              
            </div>
            
        </div> 
        
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
        color:#03a9f4;
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
  `]
})
export class OrderNewPopup implements OnInit{

  @Input() data:OrderWFCompData;
  @Output() action:any;

  public productList:Array<BillItemData>;
  public goodsList:Array<BillItemData>;
  public cardList:Array<BillItemData>;
  public packageList:Array<BillItemData>;
  public orderPay:number = 0;//实际应收 可修改
  public payAmount:number = 0;//实收
  public restAmount:number = 0;//还需支付

  private activeModal:any;

  constructor(@Inject(MAT_DIALOG_DATA) public dataInput:any) {
    this.activeModal = dataInput.modalCtrl;
  }

  ngOnInit(): void {
    if(!AppUtils.isNullObj(this.data)){
      this.productList = this.data.billList.filter((item:BillItemData)=>{
        if(item.type == BuyTypeEnum.PRODUCT){
          return true;
        }else{
          return false;
        }
      })
      this.goodsList = this.data.billList.filter((item:BillItemData)=>{
        if(item.type == BuyTypeEnum.GOODS){
          return true;
        }else{
          return false;
        }
      })
      this.cardList = this.data.billList.filter((item:BillItemData)=>{
        if(item.type == BuyTypeEnum.PRDCARD){
          return true;
        }else{
          return false;
        }
      })
      this.packageList = this.data.billList.filter((item:BillItemData)=>{
        if(item.type == BuyTypeEnum.PACKAGE){
          return true;
        }else{
          return false;
        }
      })

      this.orderPay = AppUtils.appendZero(this.data.orderCost);

      if(!AppUtils.isNullObj(this.data.order) && !AppUtils.isNullObj(this.data.order.payItems)){
        for(let i=0;i<this.data.order.payItems.length;i++){
          let payItem = this.data.order.payItems[i];
          for(let j=0;j<this.data.payList.length;j++){
            let payItemData = this.data.payList[j];
            if(payItemData.payType == payItem.payType){
              payItemData.outTradeNo = payItem.outTradeNo;
              payItemData.value = payItem.cost;
              payItemData.isSelect = true;
              payItemData.canEdit = false;
            }
          }
        }
      }

      this.changePayAmount();
    }

  }

  /**
   * 修改实际应收
   * @param e
   */
  changeOrderPay(e){
    let pay = e.target.value;
    pay = pay?pay:this.data.orderCost;
    pay = pay>0?pay:this.data.orderCost;
    this.orderPay = AppUtils.appendZero(pay);
    this.changePayAmount();
  }

  /**
   * 是否已选择支付方式
   * @returns {boolean}
   */
  checkHas():boolean{
    let has:boolean = false;
    for(let i=0;i<this.data.payList.length;i++){
      let payItem = this.data.payList[i];
      if(payItem.isSelect){
        has = true;
        break;
      }
    }
    return has;
  }

  /**
   * 页面点击事件 计算应收
   */
  changePayAmount(){
    let hasPayAmount = 0;
    this.data.payList.forEach((item:PayItemData)=>{
      if(item.isSelect && !AppUtils.isNullObj(item.value)){
        hasPayAmount = hasPayAmount + parseFloat(item.value.toString());
      }
    })
    this.restAmount = AppUtils.appendZero((this.orderPay - hasPayAmount));
  }

  /**
   * 确认付款
   */
  confirm():void{
    if(!this.checkMemberCardAmount()){
      AppUtils.showWarn("提示","卡扣金额不得超过会员卡余额");
    }
    else if(!this.checkAmount()){
      AppUtils.showWarn("提示","实付与应结金额不符，请检查金额输入");
    }
    else if((this.data.orderCost != 0) && this.checkPay()){
      AppUtils.showWarn("提示","请检查金额输入");
    }else{
      if((this.data.orderCost == 0) && this.checkPay()){
        for(let i=0;i<this.data.payList.length;i++){
          let payItem = this.data.payList[i];
          if(payItem.payType == PayTypeEnum.CASH){
            payItem.isSelect = true;
            payItem.value = 0;
            break;
          }
        }
      }
      this.action();
      this.closeModal();
    }
  }

  /**
   * 取消 关闭弹框
   */
  closeModal():void{
    this.activeModal.close();
  }

  /**
   * 检查卡扣金额是否相符
   */
  checkMemberCardAmount():boolean{
    let success:boolean = true;
    for(let i=0;i<this.data.payList.length;i++){
      let payItem = this.data.payList[i];
      if((payItem.payType == PayTypeEnum.MEMBERSHIPCARD) && payItem.isSelect && !AppUtils.isNullObj(payItem.value)){
        if(payItem.value > this.data.balance){
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
  checkAmount():boolean{
    if(this.restAmount == 0){
      return true;
    }else{
      return false;
    }
  }

  /**
   * 检查是否输入支付金额 true
   * @returns {boolean}
   */
  checkPay():boolean{
    let success:boolean = true;
    for(let i=0;i<this.data.payList.length;i++){
      let payItem = this.data.payList[i];
      if(!AppUtils.isNullObj(payItem.value)){
        success = false;
        break;
      }
    }
    return success;
  }

}



