import {Component, Input, Output, EventEmitter, OnInit} from "@angular/core";

//<zmb-order-detail-item [title]="'购买信息'" [imgSrc]="item.pgImg|zmImgPath" [name]="item.pgName" [typeName]="item.pgTypeName" [price]="item.price" [count]="item.count" [discount]="item.discount"></zmb-order-detail-item>
@Component({
  selector:'zmb-order-detail-item',
  template: `
  <div style="margin-bottom: 5px">
    <zmbItem [imgUrl]="imgSrc" [name]="name" [count]="count" [price]="price" [itemTag]="typeName"></zmbItem>
    <div style="background:#f4f4f4;margin:0 10px;padding:0 10px;"  fxLayout="row" fxLayoutAlign="space-between center" *ngIf="type == 0">
        <span> 折扣:{{discount|zmDiscountPipe}}</span>
        <span> 小计: ￥{{totalPrice|number:'1.2-2'}}</span>
    </div>
  </div>
    

            `,
  styles:[`
  [item-start] {
    margin: 5px 16px 0px 0 !important;
}
    `]
})


export class ZmbOrderDetailItem implements OnInit{

  @Input() type:string;//0 购买 1赠送
  @Input() imgSrc:string;
  @Input() name:string;
  @Input() typeName:string;
  @Input() count:number;
  @Input() price:number;
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
      this.totalPrice = this.price * this.count *(this.discount/10);
    }
  }

  addCount(count:number){
    this.zmCount = this.zmCount+count;
  }

}


