import {Component, Input, Output, EventEmitter, OnInit, OnChanges} from "@angular/core";
import {AppUtils} from "../../../../comModule/AppUtils";
/**
 * Created by helen on 2018/2/28.
 * 表单提交按钮
 <zm_login_phone [(zmValue)]="viewData.formData.phone" [(zmPass)]="viewData.formData.phonePass"  (valueChecked)="viewData.formData.check()" (click)="clearSubmitError()" ></zm_login_phone>

 <zm_login_password [(zmValue)]="viewData.formData.password" [(zmPass)]="viewData.formData.passwordPass"  (valueChecked)="viewData.formData.check()" (click)="clearSubmitError()" (keyup)="isEnter($event)"></zm_login_password>
 <zm_login_button [text]=" '登录' " [canSubmit]="viewData.formData.canSubmit" (zmClick)="login()" [errorMsg]="viewData.formData.submitErrorMsg"></zm_login_button>
 */

@Component({
  selector:'zm_login_button',
  template: ` 
          <div class="">
            <button type="submit" class="c-btn-blue  fz-18 btn-valid-success zmCurHand" style="height: 48px;padding:0;width: 100%;border: none;" [ngClass]="{'btn-valid-error':hasError}" [disabled]="!canSubmit"
                    (click)="submit()">{{text}}
            </button>
             <div class="c-input-error font-c3 text-center" style="line-height: 30px;height: 30px;" >{{errorMsg}}</div>
          </div>
            `,
  styleUrls: ['./loginInput.scss']

})

export class ZmLoginButton implements OnInit,OnChanges{

  @Input() text: string;

  hasError:boolean=false;

  private errorMsgTmp:string;
  @Input()
  get errorMsg() {
    return this.errorMsgTmp;
  }
  set errorMsg(val) {

    this.errorMsgTmp = val;
    this.hasError = !AppUtils.isNullOrWhiteSpace(this.errorMsgTmp);
    console.log("errorMsgTmp:"+this.errorMsgTmp);
    console.log("hasError:"+this.hasError);
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
