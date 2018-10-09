import {Component, Input, Output, EventEmitter, OnChanges} from "@angular/core";

@Component({
  selector: 'zmk-shop-cart-item',
  template: `

        <!-- Nav tabs -->
          <ion-item zmk-item-sm>
              <div  fxLayout="row" fxLayoutAlign="space-between center" >
                  <span style="width:50%;" overflow-hidden-1 item-subtitle>{{item.name}}</span>
                  <div  style="width:50%;" fxLayout="row" fxLayoutAlign="end center" >
                  
                      <span  item-title *ngIf="item.promotionFlag == 0">¥{{item.price|number:'1.2-2'}}</span>
                       <span  item-title *ngIf="item.promotionFlag == 1">¥{{item.promotionPrice|number:'1.2-2'}}</span>
                      <div style="width:80px;"  fxLayout="row" fxLayoutAlign="end center">
                         <ion-icon  color="primary" ios="ios-remove-circle-outline" md="md-remove-circle" (click)="addCount(-1)"></ion-icon>
                         <span px-1 >{{zmCount}}</span>
                         <ion-icon color="primary" name="add-circle" (click)="addCount(1)"></ion-icon>
                      </div>
                  </div>
              </div>
          </ion-item>
          
          
          
            `
})


export class ZmkShopCartItem implements OnChanges {

  @Input() item: any;
  // @Input() name: string;
  // @Input() price: string;
  @Output() onChange = new EventEmitter();

  /**
   * zmCount 双向绑定
   */
  private zmCountTmp: number;
  @Output() zmCountChange = new EventEmitter();

  @Input()
  get zmCount() {
    return this.zmCountTmp;
  }

  set zmCount(val) {
    this.zmCountTmp = val;
    this.zmCountChange.emit(this.zmCountTmp);
  }

  constructor() {
  }

  ngOnChanges() {
  }

  addCount(count: number) {
    if (count == -1 && this.zmCount == 0) {
      this.zmCount = 0;
    } else {
      this.zmCount = this.zmCount + count;
    }
    this.onChange.emit();
  }

}


