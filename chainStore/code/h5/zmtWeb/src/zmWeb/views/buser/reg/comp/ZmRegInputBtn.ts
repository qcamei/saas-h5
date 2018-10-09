import {Component, Input, Output, EventEmitter, OnInit, OnChanges} from "@angular/core";
import {AppUtils} from "../../../../comModule/AppUtils";
/**
 * Created by helen on 2018/2/28.
 * 表单提交按钮
 <zm_reg_input_btn [text]=" '注册' " [canSubmit]="viewData.formData.canSubmit" (zmClick)="reg()" [errorMsg]="viewData.formData.submitErrorMsg"></zm_reg_input_btn>
 */

@Component({
  selector:'zm_reg_input_btn',
  template: ` 
          <div class="" style="margin-left:106px">
            <button notRepeatSubmit type="submit" mat-raised-button color="accent" class="fz-18 zmCurHand" style="height: 48px;padding:0;width: calc(100%);border: none;" [ngClass]="{'btn-valid-error':hasError}" [disabled]="!canSubmit"
                    (submit)="submit()">{{text}}
            </button>
             <div class="c-input-error font-c3 text-center" style="line-height: 30px;height: 30px;margin-left: 0;" >{{errorMsg}}</div>
          </div>
            `,
  styleUrls: ['./regInput.scss']

})

export class ZmRegInputBtn implements OnInit,OnChanges{

  @Input() text: string;

  hasError:boolean = false;

  private errorMsgTmp:string;
  @Input()
  get errorMsg() {
    return this.errorMsgTmp;
  }
  set errorMsg(val) {

    this.errorMsgTmp = val;
    this.hasError = !AppUtils.isNullOrWhiteSpace(this.errorMsgTmp);
  }
  @Input() canSubmit:boolean;
  @Output() zmClick = new EventEmitter();

  constructor(){
  }


  ngOnInit(){
  }

  ngOnChanges(){
  }

  submit() {
    this.zmClick.emit();
  }

}
