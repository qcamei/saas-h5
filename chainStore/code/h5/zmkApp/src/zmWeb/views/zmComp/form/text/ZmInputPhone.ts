import {Component, Input, Output, EventEmitter} from "@angular/core";
import {AppUtils} from "../../../../comModule/AppUtils";
/**
 <zm-input-phone [(zmValue)]="viewData.formData.phone" [(zmPass)]="viewData.formData.phonePass"
 (valueChecked)="viewData.formData.check()" ></zm-input-phone>

 */

@Component({
  selector:'zm-input-phone',
  template: `

                  <ion-item>
                    <ion-label stacked>手机号</ion-label>
                    <ion-input placeholder="请输入手机号" type="number" [disabled]="disabled" [(ngModel)]= "zmValue" (ionBlur)="check()"></ion-input>
                  </ion-item> 
                  
                  <div class="input-error">
                      <div *ngIf="!zmPass">
                          {{errorMsg}}
                      </div>
                  </div>   

            `,

})

export class ZmInputPhone{
  constructor(){}

  @Output() valueChecked:EventEmitter<any> = new EventEmitter();
  errorMsg:string="";
  active:boolean=false;

  /**
   * zmValue 双向绑定
   */
  private zmValueTmp:string;
  @Output() zmValueChange = new EventEmitter();

  @Input() required:boolean = true;

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
    if(!this.required){
      return;
    }
    this.active = true;
    let phone = "";
    if(!AppUtils.isNullOrWhiteSpace(this.zmValueTmp)){
      phone = this.zmValueTmp;
    }
    if(AppUtils.isNullOrWhiteSpace(phone)){
      this.zmPass = false;
      this.errorMsg = "手机号不能为空";
    }else{
      let regExp = new RegExp("^\\s*[1][1-9]\\d{9}$|^([6|9])\\d{7}$|^[0][9]\\d{8}$|^[6]([8|6])\\d{5}\\s*$");
      let b = regExp.test(phone);
      if (b == false) {
        this.zmPass = false;
        this.errorMsg = "手机号格式错误";
      }else{
        this.zmPass = true;
        this.errorMsg = "";
      }
    }

    //通知外部 value做了检查
    this.valueChecked.emit();
  }
}


