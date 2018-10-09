import {Component, Input} from "@angular/core";

@Component({
  selector:'zmb-order-recharge-item',
  template: `

        <ion-item zmk-item-sm style="background:#f4f4f4;font-size:12px" >
           <div fxLayout = "row" fxLayoutAlign="start center" fxLayoutGap="10px">
               <div item-start style="width:70px;height:56px;">
                    <img style="width: 100%;height: 100%" :src="{{imgSrc|zmImgPath}}">
               </div>
               <div fxLayout="column" w-100>
                   <div  fxLayout="column">
                        <span>{{name}}</span>
                         <div *ngIf="pay">
                             <span>充值：￥{{pay|number:'1.2-2'}}</span>
                         </div>
                         <div *ngIf="largess">
                             <span>赠送：￥{{largess|number:'1.2-2'}}</span>
                         </div>
                   </div>   
               </div> 
           </div>
         </ion-item>
            `,
  styles:[`
    `]
})


export class ZmbOrderRechargeItem{

  @Input() pay:number;
  @Input() largess:number;

  imgSrc:string;
  name:string = "会员充值";

}


