import {Component, Input, OnInit, OnChanges} from "@angular/core";
import {OrderTrackStatusEnum} from "../../../../bsModule/orderTrack/data/OrderTrackStatusEnum";

@Component({
  selector: 'order-track-comp',
  template: `
        <div *ngIf="trackStatus != 0 && trackStatus!= 4" fxLayout="row" fxLayoutGap="5px" fxLayoutAlign="start center" w-100 style="border-bottom:1px solid #F3F3F3;padding:10px 10px 10px 10px;">
            <ion-icon ios="ios-car" style="font-size:19px;"></ion-icon>
            <div fxLayout="column" fxLayoutGap="5px"  style="width:93%;"> 
                 <div fxLayout="row" fxLayoutAlign="space-between center">{{content}}</div>
                 <div  fxLayout="row wrap" fxLayoutAlign="space-between center">
                     <span style="color:#666;">{{lastUpdateTime|zmDatePipe}}</span>
                     <div *ngIf="courierNum">运单号:<span style="color:#666;">{{courierNum}}</span></div>
                 </div>
            </div>
        </div>
            `
})
export class OrderTrackComp implements OnInit,OnChanges {

  @Input() trackStatus: number;
  @Input() company;
  @Input() lastUpdateTime;
  @Input() courierNum;

  public content: string;


  ngOnInit() {
    this.initData();
  }

  ngOnChanges() {
    this.initData();
  }

  initData() {
    if(this.trackStatus){
      this.trackStatus = parseInt(this.trackStatus.toString());
      switch (this.trackStatus) {
        case OrderTrackStatusEnum.Pay://待发货
          this.content = "您提交了订单，请等待商家确认发货。";
          break;
        case OrderTrackStatusEnum.Send://已发货
          this.content = "订单已交由" + this.company + "配送，运单号：" + this.courierNum + "。如有疑问请联系商家。";
          break;
        case OrderTrackStatusEnum.Finish://已完成
          this.content = "订单已签收，欢迎您下次购买。";
          break;
      }
    }

  }

}
