import {Component, Input, Output, EventEmitter} from "@angular/core";
import {AppUtils} from "../../../../comModule/AppUtils";
/**
 *
 * <change_pwd [(zmValue)]="viewData.resetFormData.password" [(zmPass)]="viewData.resetFormData.passwordPass"
 (valueChecked)="viewData.resetFormData.check()"></change_pwd>
 */

@Component({
  selector:'change_pwd',
  template: `
                <div class="disFlex align-center">
                  <label class="c-input-label">新密码</label>
                  <input type="password" placeholder="请输入6-16位新密码" class="c-input"  [(ngModel)] = "zmValue" [ngClass]="{'form-valid-error':active && !zmPass}" (keyup)="check()"/>
                </div>
                 <div class="c-input-error">
                      <div *ngIf="!zmPass">
                          {{errorMsg}}
                      </div>
                 </div>      
            `,
  styleUrls: ['./input.scss']

})

export class ChangePwd{
  constructor(){}

  @Output() valueChecked:EventEmitter<any> = new EventEmitter();
  errorMsg:string="";
  active:boolean=false;

  /**
   * zmValue 双向绑定
   */
  private zmValueTmp:string;
  @Output() zmValueChange = new EventEmitter();

  @Input()
  get zmValue() {
    return this.zmValueTmp;
  }
  set zmValue(val) {
    this.zmValueTmp = val;
    this.zmValueChange.emit(this.zmValueTmp);
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

  private zmCheckMarkTmp:string;
  //zmCheckMark 不一样的时候做检测，一般是由提交按钮发起的
  @Input()
  get zmCheckMark():string {
    return this.zmCheckMarkTmp;
  }
  set zmCheckMark(val:string) {
    if(!AppUtils.isNullOrWhiteSpace(val) && val != this.zmCheckMarkTmp ){
      this.zmCheckMarkTmp = val;
      this.check();
    }
  }

  public check() {
    this.active = true;
    if(AppUtils.isNullOrWhiteSpace(this.zmValueTmp)){
      this.zmPass = false;
      this.errorMsg = "密码不能为空";
    }else{
      if(this.zmValueTmp.match(/^\s*([\da-zA-Z]{6,16})\s*$/)){
        this.zmPass = true;
        this.errorMsg = "";
      }else{
        this.zmPass = false;
        this.errorMsg = "密码至少为6-16位数字或字母";
      }
    }

    //通知外部 value做了检查
    this.valueChecked.emit();
  }
}


