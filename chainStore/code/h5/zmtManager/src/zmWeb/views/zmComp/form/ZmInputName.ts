import {Component, Input, Output, EventEmitter} from "@angular/core";
import {AppUtils} from "../../../comModule/AppUtils";
/**
 * Created by helen on 2018/2/28.
 * 电话号码输入框  支持港澳台
 *
 <zm_input_name [(zmValue)]="viewData.formData.name" [(zmPass)]="viewData.formData.namePass"
 (valueChecked)="viewData.formData.check()" ></zm_input_name>

 */

@Component({
  selector:'zm_input_name',
  template: `
             <div class="disFlex align-center">
                    <label class="c-input-label">姓名</label>
                    <input [ngClass]="{'form-valid-error':active && !zmPass}" type="text" placeholder="请输入姓名" class="c-input" [(ngModel)] = "zmValue"  (blur)="check()" >
             </div>
             
             <div class="c-input-error">
                  <div *ngIf="!zmPass">
                      {{errorMsg}}
                  </div>
             </div>         
            `,
  styleUrls: ['./input.scss']

})

export class ZmInputName{
  constructor(){}

  @Output() valueChecked:EventEmitter<any> = new EventEmitter();
  errorMsg:string="";
  active:boolean=false;

  /**
   * zmvalue 双向绑定
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
    if(AppUtils.isNullOrWhiteSpace(this.zmCheckMarkTmp)){
      this.zmCheckMarkTmp = val;
    }else if(!AppUtils.isNullOrWhiteSpace(val) && val != this.zmCheckMarkTmp ){
      this.zmCheckMarkTmp = val;
      this.check();
    }
  }



  public check() {
    this.active = true;

    let name = this.zmValueTmp;

    if(AppUtils.isNullOrWhiteSpace(name)){
      this.zmPass = false;
      this.errorMsg = "用户名不能为空 ";
    }else if(name.length > 10){
      this.zmPass = false;
      this.errorMsg = "用户名最大长度为10个字符";
    }else{
      this.zmPass = true;
      this.errorMsg = "";
    }
    //通知外部 value做了检查
    this.valueChecked.emit();
  }
}


