import {Component, Input, Output, EventEmitter} from "@angular/core";
/**
 * Created by sunbirdjob on 2018/3/8.
 * 必填文本输入框
 * <zm_reg_input_checkbox   [(zmValue)]="viewData.zmtChecked" ><content class="cur-hand">我已同意</content></zm_reg_input_checkbox>
 */

@Component({
  selector:'zm_reg_input_checkbox',
  template: `
            <div (click)="cheed()" class="disFlex align-center">
                <!--<input type="checkbox" class="c-input-checkbox">-->
                <span class="c-child-checkbox cur-hand disFlex align-center" >
                <span style="width: 16px;height: 16px;display: inline-block;"><img src="assets/images/icon/checkbox.png" alt="" *ngIf="cheStyle" style="display: inherit;"></span>
                  <span style="width: 16px;height: 16px;display: inline-block;margin-left: -16px;"><img src="assets/images/icon/checkboxNo.png" alt="" *ngIf="!cheStyle" style="display: inherit;"></span>
                </span>
                <span class="mg-l-10 cur-hand" >{{lable}}</span>
              <ng-content select="content"></ng-content>
            </div>
            `,
  styleUrls: ['./regInput.scss']
})

export class ZmRegInputCheckbox {

  @Input() lable:string;
  public cheStyle: boolean = false;

  private valueTmp:any;
  @Output() zmValueChange = new EventEmitter();

  @Output() valueChecked:EventEmitter<any> = new EventEmitter();



  @Input()
  get zmValue() {
    return this.valueTmp;
  }
  set zmValue(val) {
    this.valueTmp = val;
    this.zmValueChange.emit(this.valueTmp);

    this.valueChecked.emit();
  }

  cheed():void{
    this.valueTmp= !this.valueTmp;
    this.cheStyle = !this.cheStyle;
    this.zmValueChange.emit(this.valueTmp);
  }


  ngOnInit(): void {
    if (this.valueTmp) {
      this.cheStyle = !this.cheStyle;
    } else {
      this.cheStyle = this.cheStyle;
    }
  }

}
