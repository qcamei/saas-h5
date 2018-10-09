import {Component, Input, Output, EventEmitter} from "@angular/core";

// <zmk-goods-item  zmk-item-lg imgSrc="{{item.defaultImg|zmImgPath}}" name="{{item.name}}" price="￥{{item.price}}" typeName="{{item.typeName}}" [(zmCount)] = "count"></zmk-goods-item>

@Component({
  selector: 'zmk-goods-item',
  template: `

        <!-- Nav tabs -->
          <!--<ion-card class="fade-in-right-item">-->
           <ion-card>
            <ion-item>
              <div item-start style="width: 56px;height:56px;position:relative;">
                    <img style="width: 100%;height: 100%" [src]="imgSrc">
                    <span *ngIf="hotSales==1" style="background:red;color:#ffffff;border-radius:10px;padding:0 5px;position:absolute;left:-15px;top:-5px;font-size:10px;">促销</span>
              </div>
              <ion-row>           
                  <div fxLayout="column" style="width:100%;">
                      <div  fxLayout="column">
                           <span item-title>{{name}}</span>
                           <div fxLayout="row wrap" fxLayoutAlign="space-between center">
                             <span  theme-color theme-border  mr-1 *ngIf="typeName">{{typeName}}</span>
                             <div style="width:90px;"  fxLayout="row" fxLayoutAlign="end center">
                                  <ion-icon *ngIf="zmCount>0" color="primary" ios="ios-remove-circle-outline" md="md-remove-circle" (click)="addCount(-1)"></ion-icon>
                                  <span px-1 *ngIf="zmCount>0">{{zmCount}}</span>
                                  <ion-icon color="primary" name="add-circle" (click)="addCount(1)"></ion-icon>
                              </div>
                           </div>
                      </div>   
                    
                       <div  fxLayout="row"  >
                              <div>
                                <span style="color:red;" *ngIf="hotSales==1 && promotionPrice!=price" >￥{{promotionPrice|number:'1.2-2'}}</span>
                                <s *ngIf="hotSales==1 && promotionPrice!=price" item-subtitle style="opacity:0.5">￥{{price|number:'1.2-2'}}</s>
                                <span *ngIf="hotSales==0 || (hotSales==1 && promotionPrice==price)" item-subtitle>￥{{price|number:'1.2-2'}}</span>
                              </div>
                             
                       </div>
                 </div>  
              </ion-row>
          </ion-item>
          </ion-card>
          
          
            `,
  styles: [`
    `]
})


export class ZmkGoodsItem {

  @Input() imgSrc: string;
  @Input() name: string;
  @Input() typeName: string;
  @Input() price: string;
  @Input() promotionPrice: string;
  @Input() hotSales:number = 0;


  /**
   * zmCount 双向绑定
   */
  private zmCountTmp: number;
  @Output() zmCountChange = new EventEmitter();

  @Input()
  get zmCount() {
    return this.zmCountTmp;
  }

  set zmCount(val: number) {
    this.zmCountTmp = val;
    this.zmCountChange.emit(this.zmCountTmp);
  }

  constructor() {
  }

  addCount(count: number) {
    if (count == -1 && parseInt(this.zmCount.toString()) == 0) {
      this.zmCount = 0;
    } else {
      this.zmCount = parseInt(this.zmCount.toString()) + count;
    }
  }

}


