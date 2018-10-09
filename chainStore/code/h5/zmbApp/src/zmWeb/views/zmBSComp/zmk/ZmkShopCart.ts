import {Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef} from "@angular/core";

@Component({
  selector: 'zmk-shop-cart',
  template: `

        <!-- Nav tabs 
          <ion-footer>-->
               <div  *ngIf="show" style="position:fixed;left:0;bottom:0;background:rgba(0,0,0,0.5);width:100%;height:100%;">
              
               </div>
               <ion-list #shopList w-100 style="position:relative;z-index:10" class="notAnimation" [class.isAnimation]="show">
                
                  <ion-item zmk-item-sm style="background:#F7F7F7;height:30px !important;" >
                   <div fxLayout="row" fxLayoutAlign="space-between center">
                        <div>已选商品</div>
                        <div (click)="removeList()"><ion-icon ios="ios-trash"></ion-icon>清空购物车</div>
                    </div>
                  </ion-item>
                
                  <div  style="max-height:265px;overflow:scroll;" >
                    <div *ngIf="itemList.length == 0" style="height:265px;background:#fff;" fxLayout="row" w-100 fxLayoutAlign="center center"><span>购物车为空</span>
                    </div>
                    <div *ngFor="let item of itemList">
                      <zmk-shop-cart-item [name]="item.name" [price]="item.price" [(zmCount)] = "item.count" (onChange)="reSumPrice()"></zmk-shop-cart-item>
                    </div>
                    
                  </div>
               </ion-list>
          
          
                <ion-row >
                   <div #shop bg-shopping style="position:relative;z-index:20;color:#ffffff;width:65%; padding:10px 0 0 20px;font-size:20px;">
                         <span text-center text-white style="position:absolute;min-width:17px;left:40px;padding:0 2px;border-radius:50%;font-size:12px;background:red;" *ngIf="totalCount>0">{{totalCount}}</span>
                         <ion-icon name="cart" item-start></ion-icon>
                           <span >共 ￥{{totalPrice|number:'1.2-2'}}</span>
                    </div>
                    <div (click)="goAddPreOrder()" header-bcg text-center style="position:relative;z-index:20;color:#ffffff;font-size:18px;width:35%;line-height:53px;" >去结算</div>
                </ion-row>
        
       <!-- </ion-footer>-->
          
            `,
  host: {
    '(document:click)': 'initDropList($event)',
    '[style.width]': "'100%'"
  },
  styles: [`
  [bg-shopping]{
    background:#4C4C4C;
  }
  .notAnimation{
    height:0;
    overflow:hidden;
    transition:all 0.1s ease-out !important;
    background:#ffffff;
  }
  .isAnimation{
   height:335px;
    transform:translateY(0) !important;
   
  }
    `]
})


export class ZmkShopCart implements OnInit {
  @ViewChild('shop') shop: ElementRef;
  @ViewChild('shopList') shopList: ElementRef;
  @Input() itemList: Array<any>;
  @Output() callback: EventEmitter<number> = new EventEmitter<number>();

  show: boolean = false;
  private totalCount: number = 0;
  private totalPrice: number = 0;

  initDropList(event) {
    if (this.shop.nativeElement.contains(event.target)) {
      this.show = !this.show;
    } else if (this.shopList.nativeElement.contains(event.target)) {
      this.show = true;
    } else {
      this.show = false;
    }

  }


  constructor() {
  }

  ngOnInit() {
    this.reSumPrice();
  }

  reSumPrice() {
    this.totalCount = 0;
    this.totalPrice = 0;
    if (this.itemList && this.itemList.length > 0) {
      this.itemList.forEach((item) => {
        this.totalCount += parseInt(item.count.toString());
        let itemPrice = item.price * 100;
        let price = parseInt((item.count * itemPrice).toString()) / 100;
        this.totalPrice += price;
      });
    }
  }

  removeList() {
    if (this.itemList && this.itemList.length > 0) {
      this.itemList.forEach((item) =>{
        item.count = 0;
      });
      this.itemList = [];
    }
  }

  goAddPreOrder() {
    this.callback.emit(this.totalPrice);
  }

}


