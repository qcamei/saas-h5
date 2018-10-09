import {Input, OnInit, Component} from "@angular/core";
import {PayItem} from "../../../../bsModule/order/data/PayItem";

// <zmb-pay-info [payItems]="viewData.orderDetail.payItems"></zmb-pay-info>

@Component({
  selector:'zmb-pay-info',
  template: `

           
  <div style="padding-bottom:10px;">
    <ion-row> 
        <zmk-title w-100 name="支付信息" ></zmk-title>  
    </ion-row>
    <ion-row style="padding:0 10px;">
    <div w-100 fxLayout="row" fxLayoutAlign="space-between center" *ngFor="let payItem of payItems">
        <div><span ml-2>{{payItem.payType|orderPayTypePipe}}</span></div>
        <span>￥{{payItem.cost}}</span>
    </div>    
    </ion-row>
  

</div>

            `
})


export class ZmbPayInfo implements OnInit{

  @Input() payItems:Array<PayItem>;
  constructor(){ }

  ngOnInit(){

  }

}


