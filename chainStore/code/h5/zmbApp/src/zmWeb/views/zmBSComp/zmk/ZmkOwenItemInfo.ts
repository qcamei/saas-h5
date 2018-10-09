import {Component, Input, Output, EventEmitter, OnInit} from "@angular/core";
// <zmk-own-itemInfo zmk-item-sm imgSrc="" name="" typeName=""[(zmCount)] = "count"></zmk-own-itemInfo>
@Component({
  selector:'zmk-own-itemInfo',
  template: `

  <ion-item zmk-item-sm style="background:#FBFBFB;" >
  <div item-start>
        <img zmk-img-rect-small [src]="imgSrc">
  </div>
  <ion-row>           
      <div fxLayout="column" style="width:100%;">
            <span item-title>{{name}}</span>
        
           <div  fxLayout="row" fxLayoutAlign="space-between center" >
                  <div>
                  <span item-subtitle>￥{{price|number:'1.2-2'}}</span>  
                  <span theme-color  theme-border  mr-1 *ngIf="typeName">{{typeName}}</span></div>
                  <div  fxLayout="row" fxLayoutAlign="end center">
                       <span px-1 >x{{count}}</span>
                  </div>
           </div>
     </div>  
  </ion-row>

     
</ion-item>
<ion-row style="background:#FBFBFB; padding:0 10px 2px 10px;"  fxLayout="row" fxLayoutAlign="space-between center">
    <span> 折扣:{{discount|zmDiscountPipe}}</span>
    <span> 小计: ￥{{totalPrice|number:'1.2-2'}}</span>
</ion-row>
          
          
            `,
  styles:[`
  [item-start] {
    margin: 5px 16px 0px 0 !important;
}
    `]
})


export class ZmkOwenItemInfo implements OnInit{

  @Input() imgSrc:string;
  @Input() name:string;
  @Input() typeName:string;
  @Input() price:number;
  @Input() count:number;
  @Input() discount:number;

  private totalPrice:number = 0;

  /**
   * zmCount 双向绑定
   */
  private zmCountTmp:string;
  @Output() zmCountChange = new EventEmitter();

  @Input()
  get zmCount() {
    return this.zmCountTmp;
  }
  set zmCount(val) {
    this.zmCountTmp = val;
    this.zmCountChange.emit(this.zmCountTmp);
  }

  constructor(){ }

  ngOnInit(){
    if(this.price && this.count) {
      this.totalPrice = this.price * this.count;
    }
  }

  addCount(count:number){
    this.zmCount = this.zmCount+count;
  }

}


