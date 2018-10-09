import {Component, Input, OnInit, OnChanges, Output, EventEmitter} from "@angular/core";
import {OrderTrackTypeEnum} from "../../../../bsModule/orderTrack/data/OrderTrackTypeEnum";
import {OrderOriginEnum} from "../../../../bsModule/order/data/OrderOriginEnum";
import {OrderTrackStatusEnum} from "../../../../bsModule/orderTrack/data/OrderTrackStatusEnum";
import {OrderStatusEnum} from "../../../../bsModule/order/data/OrderStatusEnum";

@Component({
  selector: 'order-status-comp',
  template: `

       <div fxLayout="column" fxLayoutAlign="start" fxLayoutGap="5px" style="padding:10px;background:#F3F3F3;">
          <div w-100 fxLayout="row" fxLayoutAlign="space-between center" >
            <span>{{stateInfo}}</span>
            <span style="color:#666;" *ngIf="company">{{company}}</span>
          </div> 
          <span>{{content}}</span>
       </div>
            `
})
export class OrderStatusComp implements OnInit,OnChanges {

  @Input() origin: number;
  @Input() orderStatus:number;
  @Input() type: number;
  @Input() trackStatus: number;
  @Input() company: string;
  @Input() createTime:number;

  @Output() cancelCallback:EventEmitter<any> = new EventEmitter<any>();

  private stateInfo: string;
  private content: string;
  private payTime = 119;//min

  ngOnInit() {
    this.initData();
  }

  ngOnChanges() {
    this.initData();
  }

  initData() {
    if(this.trackStatus && this.origin == OrderOriginEnum.CUSTOMER){
      console.log("origin: "+this.origin);
      this.trackStatus = parseInt(this.trackStatus.toString());
      switch (this.trackStatus) {
        case OrderTrackStatusEnum.New://待付款OrderTrackStatusEnum.New
          this.getContentWithNoPay();
          break;
        case OrderTrackStatusEnum.Pay://待发货 待提取 OrderTrackStatusEnum.Pay
          if (this.type == OrderTrackTypeEnum.Prestore) {
            this.stateInfo = "等待提取";
            this.content = "店铺已为您备货，请尽快到店提取。";
          } else if (this.type == OrderTrackTypeEnum.Express) {
            this.stateInfo = "等待发货";
            this.content = "正在为您安排发货，请耐心等待。";
          }
          break;
        case OrderTrackStatusEnum.Send://已发货 待提取
          if (this.type == OrderTrackTypeEnum.Prestore) {
            this.stateInfo = "等待提取";
            this.content = "店铺已为您备货，请尽快到店提取。";
          } else if (this.type == OrderTrackTypeEnum.Express) {
            this.stateInfo = "等待收货";
            this.content = "订单正在配送中，如有问题请尽快联系商家。";
          }
          break;
        case OrderTrackStatusEnum.Finish://已完成
          if (this.type == OrderTrackTypeEnum.Prestore) {
            this.stateInfo = "已完成";
            this.content = "订单已提取，期待您再次购买。";
          } else if (this.type == OrderTrackTypeEnum.Express) {
            this.stateInfo = "已完成";
            this.content = "订单已送达，有问题请及时联系商家。";
          }
          break;
        case OrderTrackStatusEnum.Cancel://已取消
          this.stateInfo = "已取消";
          this.content = "订单被取消后可再次购买。";
          break;
      }
    }

    if(this.orderStatus && this.origin == OrderOriginEnum.BUSINESS){
      this.orderStatus = parseInt(this.orderStatus.toString());
      switch (this.orderStatus) {
        case OrderStatusEnum.NOT_PAY:
          this.getContentWithNoPay();
          break;
        case OrderStatusEnum.HAS_PAY:
          this.stateInfo = "已完成";
          this.content = "";
          break;
        case OrderStatusEnum.CHARGEBACK_ALL:
          this.stateInfo = "已退单";
          this.content = "";
          break;
      }
    }
  }

  private getContentWithNoPay(){
    let time = new Date().getTime()-this.createTime;
    let minutes = Math.ceil(time%(1000*60*60)/(1000*60));
    if(this.payTime>minutes){
      let restTime = this.payTime - minutes;
      let text = "";
      restTime>=60?text = "1小时"+(restTime-60):text = restTime+"";
      this.stateInfo = "等待付款";
      this.content = "请在"+text+"分钟内完成支付，逾期订单将被关闭。";
    }else if(this.payTime==minutes){
      this.cancelCallback.emit();
    }
  }

}
