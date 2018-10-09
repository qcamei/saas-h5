import {Component, Input, Output, EventEmitter} from "@angular/core";

/**
 * Created by helen on 2018/2/28.
 *
 <zm_input_name label="项目名称" placeholder="请输入项目名称" maxlength="15"
 [(zmValue)]="viewData.productDetail.name" [(zmPass)]="viewData.productDetail.namePass"></zm_input_name>

 */

@Component({
  selector:'zm_input_name',
  template: `
            
            <zm-input-text [label]="label" [placeholder]="placeholder" [required]="required" [disabled]="disabled" [maxlength]="maxlength"
                            [(zmValue)]="zmValue" [(zmPass)]="zmPass" (valueChecked)="onValueCheck()"></zm-input-text>

            `,

})

export class ZmInputName{


  @Output() valueChecked:EventEmitter<any> = new EventEmitter();
  @Input() required = true;
  @Input() label="姓名";
  @Input() placeholder="请输入姓名";
  @Input() disabled:boolean = false;
  @Input() maxlength = 10;

 /**
   * zmvalue 双向绑定
   */
  @Output() zmValueChange = new EventEmitter();
  private valueTmp;
  @Input()
  get zmValue():boolean {
    return this.valueTmp;
  }
  set zmValue(val) {
    this.valueTmp = val;
    this.zmValueChange.emit(this.valueTmp);
  }
  /**
   * zmPass 双向绑定
   */
  private zmPassTmp:boolean;
  @Output() zmPassChange = new EventEmitter();

  @Input()
  get zmPass():boolean {
    return this.zmPassTmp;
  }
  set zmPass(val:boolean) {
    this.zmPassTmp = val;
    this.zmPassChange.emit(this.zmPassTmp);
  }

  public onValueCheck(){
    this.valueChecked.emit(null);
  }


}



