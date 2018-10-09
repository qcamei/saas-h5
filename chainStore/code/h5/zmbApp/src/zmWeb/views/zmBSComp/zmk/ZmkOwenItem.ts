import {Component, Input} from "@angular/core";
// <zmk-own-item  [sales]="false" zmk-item-sm [imgSrc]="" [name]="" typeName=""[(zmCount)] = "count"></zmk-own-item>
@Component({
  selector:'zmk-own-item',
  template: `

  <ion-card class="fade-in-right-item">
      <ion-item  style="background:#FBFBFB;" >
        <div item-start style="width: 56px;height:56px;position:relative;">
              <img style="width: 100%;height: 100%" [src]="imgSrc">
              <span *ngIf="sales" style="background:red;color:#ffffff;border-radius:10px;padding:0 5px;position:absolute;left:-15px;top:-5px;font-size:10px;">促销</span>
        </div>
  
        <ion-row>           
            <div fxLayout="column" style="width:100%;">
                <div  fxLayout="column">
                     <span item-title>{{name}}</span>
                     <div>
                     <span theme-color  theme-border  mr-1 *ngIf="typeName">{{typeName}}</span>
                     </div>   
                </div>   
              
                 <div  fxLayout="row" fxLayoutAlign="space-between center" >
                        <div>
                          <span item-subtitle>￥{{price|number:'1.2-2'}}</span><!--折后价-->
                          <del style="color: #cccccc;font-size:12px" *ngIf="discount">￥{{price/(discount/10)|number:'1.2-2'}}</del><!--原价-->
                         </div>
                        <div  fxLayout="row" fxLayoutAlign="end center">
                             <span px-1 >x{{count}}</span>
                        </div>
                 </div>
           </div>  
        </ion-row>
      </ion-item>
  </ion-card>
  

            `
})


export class ZmkOwenItem{

  @Input() imgSrc:string;
  @Input() name:string;
  @Input() typeName:string;
  @Input() price:number;
  @Input() count:number;
  @Input() discount:number;
  @Input() sales:boolean=false;
  constructor(){}

}


