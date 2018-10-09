import {Component, Input, Output, EventEmitter} from "@angular/core";
import {RadioItem} from "../../../zmComp/form/ZmInputRadio";
/**
 *
 <zm_reg_input_gender [genderList]="viewData.formData.genderList" [(zmValue)]="viewData.formData.gender" ></zm_reg_input_gender>

 */

@Component({
  selector:'zm_reg_input_gender',
  template: `
                <div class="disFlex align-center">
                  <label class="c-input-label">性别</label>
                  <zm_input_radio  [radioList]="genderList" [(curValue)]="zmValue"></zm_input_radio>
                </div>
                <div class="c-input-error">
                </div>
            `,
  styleUrls: ['./regInput.scss'],

})

export class ZmRegInputGender{
  constructor(){}
  @Input() genderList:Array<RadioItem>;

  @Output() valueChecked:EventEmitter<any> = new EventEmitter();
  errorMsg:string="";

  /**
   * zmValue 双向绑定
   */
  private zmValueTmp:RadioItem;
  @Output() zmValueChange = new EventEmitter();

  @Input()
  get zmValue():RadioItem {
    return this.zmValueTmp;
  }
  set zmValue(val:RadioItem) {

    this.zmValueTmp = val;
    this.zmValueChange.emit(this.zmValueTmp);

  }

}


