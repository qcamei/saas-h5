import {Output, Component, EventEmitter, OnInit, OnDestroy, Input, OnChanges} from "@angular/core";
import {AppUtils} from "../../../../comModule/AppUtils";

/**
 * 价格输入框公共组件
 * eg:
 * <zm-input-price [label]="'￥'" [placeholder]="'请输入价格'" [(price)]="price"></zm-input-price>
 */
@Component({
  selector:'zm-input-price',
  template: `
               <ion-item>
                  <ion-label stacked>{{label}}</ion-label>
                  <ion-input type="number" [disabled]="disabled" placeholder="{{placeholder}}" [(ngModel)]="zmValue" (ionBlur)="priceBlur($event)"></ion-input>
                </ion-item> 
                
                <div class="input-error">
                    <div *ngIf="!zmPass">
                        {{errorMsg}}
                    </div>
                </div>   

            `
})
export class ZmInputPrice implements OnInit,OnDestroy,OnChanges {

  @Input() label:string="价格";
  @Input() placeholder:string="请输入价格";
  @Output() priceChange = new EventEmitter();

  private priceTmp:number;

  constructor(){}

  ngOnInit():void{

  }

  ngOnDestroy(): void {

  }

  @Input()
  get price(): number {
    return this.priceTmp;
  }

  set price(value: number) {
    this.priceTmp = value;
    this.priceChange.emit(this.price);
  }

  /**
   * 监听输入值的变化
   * @param changes
   */
  ngOnChanges(changes){
    // this.changePrice(changes.price.currentValue);
  }

  /**
   * 失去焦点事件
   * @param e
   */
  priceBlur(e){
    if(AppUtils.isNullOrWhiteSpace(e.target.value)){
      this.price = 0;
    }
    this.priceChange.emit(this.price);
  }

}
