import {Output, Component, EventEmitter, Input} from "@angular/core";
import {AppUtils} from "../../../comModule/AppUtils";

/**
 * 价格输入框公共组件
 * eg:
 <zm-input-price [label]="'项目售价'" [placeholder]="'请输入项目售价'" [(zmValue)]="viewData.productDetail.price"></zm-input-price>
 */
@Component({
  selector:'zm-input-price',
  template: `
             <mat-form-field class="zmFullWidth" color="accent">
                 <mat-label>{{label}}</mat-label>
                 
                 <input matInput type="number" [placeholder]="placeholder" [(ngModel)] = "zmValue" [maxlength]="maxlength" (blur)="check()" >
                 <span matSuffix>￥</span>
            </mat-form-field>
            `,
  styles:[`
    
  `]
})
export class ZmInputPrice {

  constructor(){
  }

  @Output() valueChecked:EventEmitter<any> = new EventEmitter();
  @Input() required = true;
  @Input() label="";
  @Input() placeholder="";
  @Input() maxlength = 10;
  @Input() disabled = false;

  errorMsg:string="";
  /**
   * zmvalue 双向绑定
   */
  private zmValueTmp:number=0;
  @Output() zmValueChange = new EventEmitter();

  @Input()
  get zmValue() {
    return this.zmValueTmp;
  }
  set zmValue(val) {

    this.zmValueTmp = val;
    this.zmValueChange.emit(this.zmValueTmp);

  }

  check() {
    if(!this.zmValue || !AppUtils.isNumber(this.zmValue.toString())) {
      // this.formControl.setValue("0");
      this.zmValue = 0;
    }else{
      let numValue = Number(this.zmValue);
      if(numValue < 0 ){
        numValue = 0;
      }else if(numValue > 99999999){
        numValue = 99999999;
      }
      let valueTmp = AppUtils.roundPoint(numValue,2);

      this.zmValue = valueTmp;
    }
    return true;
  }


  callbackFun(){
    this.valueChecked.emit();
  }
}
