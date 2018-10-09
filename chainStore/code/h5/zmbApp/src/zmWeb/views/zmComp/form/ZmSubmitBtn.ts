import {Component, Input, Output, EventEmitter, OnInit, OnChanges} from "@angular/core";
import {AppUtils} from "../../../comModule/AppUtils";
/**
 * Created by helen on 2018/2/28.
 * 表单提交按钮
 <zm-submit-btn [text]=" '注册' " [canSubmit]="viewData.formData.canSubmit" (zmClick)="reg()" [errorMsg]="viewData.formData.submitErrorMsg"></zm-submit-btn>
 */

@Component({
  selector:'zm-submit-btn',
  template: ` 
 
          <ion-item>
              <button  ion-button color="secondary" block (click)="submit()" [disabled]="!canSubmit">{{text}}</button>
              <div class="c-input-error" style="line-height: 30px;height: 30px;margin-left: 0;" >{{errorMsg}}</div>
          </ion-item>
          <div class="c-input-error"  >
                <div>
                    {{errorMsg}}
                </div>
            </div>  
            `,
  styles:[` 
    .c-input-error{
      position: relative;
      height: 0px;
      margin: 0px;
    }
    
    .c-input-error div{
      height: 30px;
      font-size: 12px;
      color:red;
      margin-left:16px;
      position: absolute;
      z-index: 999;
      top:-16px;
    }

`]


})

export class ZmSubmitBtn implements OnInit,OnChanges{

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
