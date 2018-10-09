import {Component, OnInit, Input} from "@angular/core";
import {AppRouter} from "../../../zmComUtils/AppRouter";
import {OrderVD} from "../../../order/list/orderList.page";
//<zmb-order-item [item]="item" [state]="item.status">
@Component({
  selector:'zmb-order-item',
  template: `

        <div class="fade-in-right-item">
            <div  style="border-top:8px solid #F3F3F3;">
              
                 <ion-row> 
                    <div style="padding:5px 10px;" w-100 fxLayout="row" fxLayoutAlign="space-between center" >
                          <span>订单号: {{item.number}}</span>
                          <span>{{item.leaguerName}}</span>
                    </div>
                 </ion-row>
          
                 <ion-row> 
                    <ion-col>
                      <zmb-order-inner-item *ngIf="item.orderType == 0" [itemList]="item.buyItems"></zmb-order-inner-item>
                      <zmb-order-recharge-item *ngIf="item.orderType == 1" [pay]="item.rechargeItem.pay" [largess]="item.rechargeItem.largess"></zmb-order-recharge-item>
                    </ion-col>  
                 </ion-row>   
                 
                 <ion-row> 
                     <div style="padding:5px 10px;" w-100 fxLayout="row" fxLayoutAlign="space-between center" >
                           <span>{{item.status|zmOrderStatusPipe}}</span>
                           <span>总计:￥{{item.totalPrice}}</span>
                      </div>
                  </ion-row>
               
                  <div *ngIf="item.status == 0" style="padding:2px 10px;"fxLayout="row" fxLayoutAlign="end">
                    <button style="font-size:12px;" ion-button small (click)="goPay($event,item.id)">去收款</button>
                  </div> 
             </div>
         </div> 
            `
})


export class ZmbOrderItem implements OnInit{

  @Input() item:OrderVD;

  constructor(){ }

  ngOnInit(){

  }

  goPay(ev,orderId:string){
    this.cancelBubble(ev);
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


