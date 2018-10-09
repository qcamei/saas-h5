import {Output, Component, EventEmitter, OnInit, OnDestroy, Input, OnChanges} from "@angular/core";
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
                 
                 <input matInput type="number" [placeholder]="placeholder" [(ngModel)] = "zmValue"  (blur)="check()" required *ngIf="required">
                 <input matInput type="number" [placeholder]="placeholder" [(ngModel)] = "zmValue"  (blur)="check()" *ngIf="!required">
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
  @Input() disabled = false;

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
    if( this.zmValue < 0 ){
      this.zmValue = 0;
    }else if( this.zmValue > 99999999){
      this.zmValue = 99999999;
    }
    let valueTmp = AppUtils.roundPoint( this.zmValue,2);

    this.zmValue = valueTmp;

    return null;
  }

  onValueCheck(){
    this.valueChecked.emit(null);
  }


}
