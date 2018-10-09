import {Component, Input, Output, EventEmitter, OnInit, OnChanges} from "@angular/core";
import {AppUtils} from "../../../comModule/AppUtils";
/**
 * Created by helen on 2018/2/28.
 * 表单提交按钮
 <zm_input_btn [text]=" '注册' " [canSubmit]="viewData.formData.canSubmit" (zmClick)="reg()"
 [errorMsg]="viewData.formData.submitErrorMsg"></zm_input_btn>
 */

@Component({
  selector:'zm_input_btn',
  template: ` 
          <div class="" style="margin-left:95px">
            <button type="submit" class="btn  c-btn-blue  fz-18 btn-valid-success" style="height: 48px;padding:0;width: calc(100%);border: none;" [ngClass]="{'btn-valid-error':hasError}" [disabled]="!canSubmit"
                    (click)="submit()">{{text}}
            </button>
             <div class="c-input-error font-c3 text-center" style="line-height: 30px;height: 30px;margin-left: 0;" >{{errorMsg}}</div>
          </div>
            `,
  styleUrls: ['./input.scss']

})

export class ZmInputBtn implements OnInit,OnChanges{

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
