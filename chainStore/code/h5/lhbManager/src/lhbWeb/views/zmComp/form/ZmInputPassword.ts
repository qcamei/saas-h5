import {Output, Component, EventEmitter, OnInit, OnDestroy, Input, OnChanges} from "@angular/core";
import {AppUtils} from "../../../comModule/AppUtils";

/**
 * 密码输入公共组件
 * eg:
 * <zm_input_password [label]="'密码'" [placeholder]="'请输入密码'" [(password)]="password" (passwordChange)="changePassword($event)"></zm_input_password>
 */
@Component({
  selector:'zm_input_password',
  template: `
             <div class="input-group c-input-group form-group">
                 <label class="c-label">{{label}}</label>
                 <input type="password" placeholder="{{placeholder}}" [(ngModel)]="password" (ngModelChange)="changePassword($event)" (focus)="passwordFocus($event)" (blur)="passwordBlur($event)"/>
             </div>
             <div class="c-input-error">
                 <div class="text-danger"  *ngIf="isEmpty||patternError">
                     <div *ngIf="isEmpty">
                        密码不能为空
                     </div>
                     <div *ngIf="patternError">
                        密码至少为6-16位数字或字母
                     </div>
                 </div>
             </div>
            `
})
export class ZmInputPassword implements OnInit,OnDestroy,OnChanges {

  @Input() label:string;
  @Input() placeholder:string;
  @Input() password:string;
  @Output() passwordChange = new EventEmitter();

  isEmpty:boolean = false;
  patternError:boolean = false;

  constructor(){}

  ngOnInit():void{

  }

  ngOnDestroy(): void {

  }

  /**
   * 监听输入值的变化
   * @param changes
   */
  ngOnChanges(changes){
    // this.changePassword(changes.password.currentValue);
  }

  /**
   * 密码变化回调
   * @param passwordP
   */
  changePassword(passwordP){
    if(!AppUtils.isNullOrWhiteSpace(passwordP)){
      if(passwordP.match(/^\s*([\da-zA-Z]{6,16})\s*$/)){
        this.isEmpty = false;
        this.patternError = false;
        this.passwordChange.emit(passwordP);
      }else{
        this.patternError = true;
      }
    }else{
      this.isEmpty = true;
      this.patternError = false;
    }
  }

  /**
   * 获取焦点事件
   * @param e
   */
  passwordFocus(e){
    this.isEmpty = false;
    this.patternError = false;
  }

  /**
   * 失去焦点事件
   * @param e
   */
  passwordBlur(e){
    this.changePassword(e.target.value);
  }

}
