import {Component, Input, Output, EventEmitter} from "@angular/core";
/**
 * Created by helen on 2018/2/28.
 * 电话号码输入框  支持港澳台
 * <zm_input_phone [label]=" 输入组件 " (zmClick)="click()" [(zmValue)]="target.value"></zm_input_phone>
 */

@Component({
  selector:'zm_input_phone',
  template: `
             <div class="input-group c-input-group form-group">
                  <label class="c-label">{{label}}</label>
                  <input type="text" [ngClass]="{'form-valid-error':phone.invalid && (phone.touched)}" pattern="^\\s*[1][1-9]\\d{9}$|^([6|9])\\d{7}$|^[0][9]\\d{8}$|^[6]([8|6])\\d{5}\\s*$" placeholder="请输入手机号" class="form-control" name = "phone" required  #phone="ngModel" [(ngModel)] = "zmValue">
             </div>
             <div  class="c-input-error">
                <div *ngIf="phone.invalid && (phone.touched)" >
                   <div *ngIf="phone.errors.required">
                      手机号不能为空
                   </div>
                   <div *ngIf="phone.errors.pattern">
                      手机号格式错误!
                   </div>
                 </div>
              </div>
            `,
  styles:[`
  
`]

})

export class ZmInputPhone{

  @Input() label: string;
  @Output() zmValueChange = new EventEmitter();
  private valueTmp:string;

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
