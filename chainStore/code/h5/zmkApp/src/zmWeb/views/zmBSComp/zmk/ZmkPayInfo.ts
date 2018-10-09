import {Component, Input, OnInit} from "@angular/core";
import {PayItem} from "../../../bsModule/order/data/PayItem";
// <zmk-payinfo  time="time" bourse="bourse" imgSrc="" payWay="payWay" maney="maney" ></zmk-payinfo>
@Component({
  selector:'zmk-payinfo',
  template: `

           
  <div style="padding-bottom:10px;">
    <ion-row> 
        <zmk-title w-100 name="支付信息" ></zmk-title>  
    </ion-row>
   <ion-row style="padding:10px;"> 
          <div w-100 style="padding-bottom:5px;">付款时间：{{payTime}}</div>
          <div w-100 *ngIf="payItem.tradeNo">交易流水：{{payItem.tradeNo}}</div>
          <div w-100 *ngIf="payItem.outTradeNo">交易流水：{{payItem.outTradeNo}}</div>
   </ion-row>
    <ion-row style="padding:0 10px;">
    <div w-100 fxLayout="row" fxLayoutAlign="space-between center">
        <div *ngIf="payItem.payType == 2"><img src="assets/img/weixin.png"><span ml-2>微信支付</span></div>
        <div *ngIf="payItem.payType == 1"><img src="assets/img/zfb.png"><span ml-2>支付宝支付</span></div>
        <!--<div *ngIf="payItem.payType != 1 && payItem.payType != 2"><img src="assets/img/weixin.png"><span ml-2>到店支付</span></div>-->
        <span>￥{{payItem.cost}}</span>
    </div>    
    </ion-row>
  

</div>

            `
})


export class ZmkPayInfo implements OnInit{

  @Input() payTime:string;//时间
  @Input() payItem:PayItem;
  constructor(){ }

  ngOnInit(){

  }

}


