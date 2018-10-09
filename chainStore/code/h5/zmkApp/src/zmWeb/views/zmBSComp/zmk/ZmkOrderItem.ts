import {Component, Input, OnInit, Output, EventEmitter} from "@angular/core";
import {OrderVD} from "../../my/myOrder/myOrder.page";
import {AppRouter} from "../../zmComUtils/AppRouter";
//<zmk-order-item [item]="item" [state]="item.status">
@Component({
  selector: 'zmk-order-item',
  template: `

        <!--<ion-card class="fade-in-right-item">-->
        <ion-card >
            <div  style="border-top:8px solid #F3F3F3;">
              
                 <ion-row> 
                    <div style="padding:5px 10px;" w-100 fxLayout="row" fxLayoutAlign="space-between center" >
                          <span item-title>订单号: {{item.number}}</span>
                          <span item-title *ngIf="item.origin==0">{{item.status|zmOrderStatusPipe}}</span>
                          <span item-title *ngIf="item.origin==1">{{item.trackStatus|zmOrderTrackStatusPipe:item.type}}</span>
                    </div>
                 </ion-row>
          
                 <ion-row> 
                    <ion-col>
                      <zmk-inner-item [itemList]="item.buyItems"></zmk-inner-item>
                    </ion-col>  
                 </ion-row>   
                 
                 <ion-row> 
                     <div style="padding:5px 10px;" w-100 fxLayout="row" fxLayoutAlign="space-between center" >
                           <span>{{item.storeName}}</span>
                           <span>实付金额:￥{{item.realPay}}</span>
                      </div>
                  </ion-row>
                  <div *ngIf="item.origin==0 && item.status == 0" style="padding:2px 10px;font-size:16px;"fxLayout="row" fxLayoutAlign="end">
                    <button ion-button small (click)="goPay($event,item.id)">去付款</button>
                  </div>
                  
                  <div *ngIf="item.origin==1 && item.trackStatus ==0" style="padding:2px 10px;font-size:16px;"fxLayout="row" fxLayoutAlign="end">
                    <button ion-button small (click)="goPay($event,item.id)">去付款</button>
                  </div>
                  <div *ngIf="item.origin==1 && (item.trackStatus == 3 || item.trackStatus == 4)" style="padding:2px 10px;font-size:16px;"fxLayout="row" fxLayoutAlign="end">
                    <button ion-button small (click)="buyAgain($event,item.id)">再次购买</button>
                  </div>
                  <div *ngIf="item.origin==1 && item.type==1 && (item.trackStatus == 1 || item.trackStatus == 2)" style="padding:2px 10px;font-size:16px;"fxLayout="row" fxLayoutAlign="end">
                    <button ion-button small (click)="confirmRecive($event,item.id)">确认收货</button>
                  </div>
                  
                  <div *ngIf="item.origin==1 && item.type==0 && (item.trackStatus == 1 || item.trackStatus == 2)" style="padding:2px 10px;font-size:16px;"fxLayout="row" fxLayoutAlign="end">
                    <button ion-button small (click)="confirmRecive($event,item.id)">确认提取</button>
                  </div>
             </div>
         </ion-card> 
            `
})


export class ZmkOrderItem implements OnInit {

  @Input() item: OrderVD;
  @Output() callback:EventEmitter<string>= new EventEmitter<string>();

  constructor() {
  }

  ngOnInit() {

  }

  goPay(ev, orderId: string) {
    this.cancelBubble(ev);
    AppRouter.getInstance().goPayTypeSelectPage(orderId);
  }

  buyAgain(ev, orderId: string) {
    this.cancelBubble(ev);
    AppRouter.getInstance().goAddOrderPageWithId(orderId);
  }

  confirmRecive(ev, orderId: string) {
    this.cancelBubble(ev);
    //确认收货
    this.callback.emit(orderId);
  }

  public cancelBubble(e) {
    var evt = e ? e : window.event;
    if (evt.stopPropagation) {
      evt.stopPropagation();
    } else {       //IE
      evt.cancelBubble = true;
    }
  }

}


