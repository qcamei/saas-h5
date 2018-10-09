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
        <div class="form-group row mb-0">
        <label class="col-md-2 col-form-label text-center px-0"><span class="text-danger">*</span>{{label}}</label>
        <div class="col-md-10 position-relative">
        <i class="position-absolute fa fa-pencil" style="color:#4678fa;left:20px;top:10px;"></i>
        <input type="number" placeholder="{{placeholder}}" maxlength="20"  class="form-control pl-4" 
        oninput="if(value.length>8)value=value.slice(0,8)"
         name="number" #number="ngModel" required 
        [ngClass]="{'form-valid-error':number.invalid && (number.touched)}" 
        [(ngModel)]="price" (blur)="priceBlur($event)">
        </div>
      </div>

      <div class="row" style="height:30px;font-size:14px;">
      <div class="col-md-2"></div>
          <div class="col-md-10 text-danger" *ngIf="isExistNumber==true">编号已存在</div>
          <div class="col-md-10 text-danger">
            <div  *ngIf="number.invalid && (number.touched)">
              <div *ngIf="number.errors.required">
             请输入金额
              </div>
            </div>
          </div>
        </div> 




            <!-- <i class="fa fa-pencil" style="color:#4678fa;left:5px;"></i>
             <input type="number" style="height:100px;" 
             placeholder="{{placeholder}}"
              oninput="if(value.length>8)value=value.slice(0,8)" 
              style="width:100%;border:none;-ms-border:none;" class="text-center" 
              [(ngModel)]="price" (blur)="priceBlur($event)">
             <span class="pos-a" style="right:3px;">{{label}}</span>-->
            `,
  styles:[`
    // .pos-a{
    //   position: absolute;
    // }
    // input[type=number] {
    //   -moz-appearance: textfield;
    // }
    // input[type=number]::-webkit-inner-spin-button,
    // input[type=number]::-webkit-outer-spin-button {
    //   -webkit-appearance: none;
    //   margin: 0;
    // }
    // .text-center{
    //   text-align: center;
    // }
    
  `]
})
export class ZmInputPrice implements OnInit,OnDestroy,OnChanges {
  isExistNumber:boolean = false;

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
