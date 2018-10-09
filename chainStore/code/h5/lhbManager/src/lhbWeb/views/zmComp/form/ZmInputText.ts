import {Component, Input, Output, EventEmitter} from "@angular/core";
/**
 * Created by sunbirdjob on 2018/2/23.
 * 必填文本输入框  maxlength="50"
 * <zm_input_text [label]=" 输入组件 " [placeholder]=" 默认值 " (zmClick)="click()" [(zmValue)]="target.value" [(checkStatus)]="false"></zm_input_text>
 */

@Component({
  selector:'zm_input_text',
  template: `
             <div class="input-group c-input-group form-group">
                <label class="c-label"><span class="font-c3">*</span>{{label}}</label>
                <input type="text" placeholder="{{placeholder}}" [ngClass]="{'form-valid-error':text.invalid && (text.touched)}" maxlength="50"
                       class="form-control " name="text" #text="ngModel" required [(ngModel)]="zmValue"/>
              </div>
              <div class="c-input-error">
                <div  *ngIf="text.invalid && (text.touched)">
                  <div *ngIf="text.errors.required">
                    {{label}}不能为空
                  </div>
                </div>
              </div>
            `
})

export class ZmInputText{

  @Input() label: string;
  @Input() placeholder: string;
  @Output() zmValueChange = new EventEmitter();
  @Output() zmStatusChange = new EventEmitter();
  private valueTmp:string;
  private statusTmp:boolean;//校验状态

  @Input()
  get zmValue() {
    return this.valueTmp;
  }
  set zmValue(val) {
    this.valueTmp = val;
    this.zmValueChange.emit(this.valueTmp);
  }

  constructor(){

  }

}
