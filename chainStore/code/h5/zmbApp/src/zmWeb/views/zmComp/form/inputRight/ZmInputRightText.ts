import {Component, Input, Output, EventEmitter} from "@angular/core";
import {AppUtils} from "../../../../comModule/AppUtils";
/**
 * Created by helen on 2018/9/21.
 *
 <zm-input-right-text [label]="'名称'" [(zmValue)]="value" [disabled]="false" [placeholder]="'请输入项目名称'"></zm-input-right-text>
 */

@Component({
  selector: 'zm-input-right-text',
  template: `
      <ion-row class="input-row">
          <ion-col col-3 >
            <input class="input-label text_left" value="{{label}}" type="text" [disabled]="true"/>
          </ion-col>
          <ion-col col-9 style="text-align: right">
             <input class="input text_right" type="text" placeholder="{{placeholder}}" [disabled]="disabled" 
                              [(ngModel)]= "zmValue" (keyup)="check()" (ionBlur)="check()"/>
          </ion-col>
      </ion-row>
      <div class="input-error">
          <div *ngIf="!zmPass">
               {{errorMsg}}
          </div>
      </div>   
            `,
  styles: [`
    .input-row{
      border-bottom: solid 1px #dedede;
      margin-left:10px;
      margin-right:10px;
    }
    .input-error{
      height: 10px;
      font-size: 12px;
      color: #FF4c6a;
      margin-left: 15px;
      margin-top: 2px;
    }
    .input{
      background-color: transparent;
      border:0px;
      width:100%;
    }
    .input-label{
      background-color: transparent;
      border:0px;
      width:100%;
    }
    .text_left{
      height: 32px;line-height: 25px;font-size: 1.2rem;text-align: left;color:grey;
    }
    .text_right{
      height: 32px;line-height: 25px;font-size: 1.2rem;text-align: right;color:grey;
    }
    `]


})

export class ZmInputRightText {
  constructor() {
  }

  @Input() label: string = "名称";
  @Input() placeholder:string = "请输入名称";
  @Input() maxLength: number = 10;
  @Input() disabled: boolean = false;
  @Input() required:boolean = false;

  @Output() valueChecked: EventEmitter<any> = new EventEmitter();

  errorMsg: string = "";
  active: boolean = false;

  /**
   * zmvalue 双向绑定
   */
  private zmValueTmp: string;
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
  private zmPassTmp: boolean;
  @Output() zmPassChange = new EventEmitter();

  @Input()
  get zmPass(): boolean {
    return this.zmPassTmp;
  }

  set zmPass(val: boolean) {
    this.zmPassTmp = val;
    this.zmPassChange.emit(this.zmPassTmp);
  }

  private zmCheckMarkTmp: string;
  //zmCheckMark 不一样的时候做检测，一般是由提交按钮发起的
  @Input()
  get zmCheckMark(): string {
    return this.zmCheckMarkTmp;
  }

  set zmCheckMark(val: string) {
    if (AppUtils.isNullOrWhiteSpace(this.zmCheckMarkTmp)) {
      this.zmCheckMarkTmp = val;
    } else if (!AppUtils.isNullOrWhiteSpace(val) && val != this.zmCheckMarkTmp) {
      this.zmCheckMarkTmp = val;
      this.check();
    }
  }


  public check() {
    this.active = true;

    let name = this.zmValue;
    if(this.required && AppUtils.isNullOrWhiteSpace(name)){
      this.errorMsg = this.label + "不能为空";
      return;
    }

    if (!AppUtils.isNullOrWhiteSpace(name) && name.length > this.maxLength) {
      this.zmPass = false;
      this.errorMsg = this.label + "最大长度为" + this.maxLength + "个字符";
    } else {
      this.zmPass = true;
      this.errorMsg = "";
    }
    //通知外部 value做了检查
    this.valueChecked.emit();
  }
}


