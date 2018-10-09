import {Output, Component, EventEmitter, OnInit, OnDestroy, Input, OnChanges} from "@angular/core";
import {AppUtils} from "../../../comModule/AppUtils";

/**
 * 价格输入框公共组件
 * eg:
 * <zm_input_price [label]="'￥'" [placeholder]="'请输入价格'" [(price)]="price"></zm_input_price>
 */
@Component({
  selector:'zm_input_price',
  template: `
             <i class="fa fa-pencil" style="color:#4678fa;left:5px;"></i>
             <input type="number" style="height:100px;" placeholder="{{placeholder}}" oninput="if(value.length>8)value=value.slice(0,8)" style="width:100%;border:none;-ms-border:none;" class="text-center" [(ngModel)]="price" (blur)="priceBlur($event)">
             <span class="pos-a" style="right:3px;">{{label}}</span>
            `
})
export class ZmInputPrice implements OnInit,OnDestroy,OnChanges {

  @Input() label:string;
  @Input() placeholder:string;
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
