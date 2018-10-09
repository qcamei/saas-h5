import {Component, Input, Output, EventEmitter} from "@angular/core";
import {AppUtils} from "../../../../comModule/AppUtils";
/**
 * Created by helen on 2018/2/28.
 *
 * eg:
 <zm-input-right-textarea [label]="'店铺介绍'" [(zmValue)]="viewData.formData.intro" maxLength="200"></zm-input-right-textarea>
 */

@Component({
  selector:'zm-input-right-textarea',
  template: `

              <ion-row class="textarea-row">
                <ion-col col-12 >
                     <input class="input-label text_left" value="{{label}}" type="text" [disabled]="true"/>
                </ion-col>
                <ion-col col-12>
                      <textarea class="textarea" [placeholder]="placeholder+label" [disabled]="disabled" 
                              [(ngModel)]= "zmValue" (keyup)="check()" (ionBlur)="check()"></textarea>
                </ion-col>
              </ion-row> 
              
              <div class="input-error">
                  <div *ngIf="!zmPass">
                      {{errorMsg}}
                  </div>
              </div>   


             <!--<ion-item>-->
                <!--<ion-label stacked>-->
                  <!--{{label}}-->
                <!--</ion-label>-->
                <!--<ion-textarea placeholder="请输入{{label}}" type="text" [disabled]="disabled" [(ngModel)]= "zmValue" (ionBlur)="check()"></ion-textarea>-->
              <!--</ion-item> -->
             <!---->
             <!--<div class="input-error">-->
                  <!--<div *ngIf="!zmPass">-->
                      <!--{{errorMsg}}-->
                  <!--</div>-->
             <!--</div>   -->
            `,
  styles:[`
        .textarea{
          width: 100%;
          height: 100px;
          padding: 5px;
          font-size: 0.8em;
          color: grey;
          border: solid 1px #dedede;
        }    
        .textarea-row{
          margin-left:10px;
          margin-right:10px;
        }

  `]


})

export class ZmInputRightTextarea{
  constructor(){}

  @Output() valueChecked:EventEmitter<any> = new EventEmitter();
  errorMsg:string="";
  active:boolean=false;
  @Input() placeholder:string = "请输入不超过200字的";

  @Input() label:string ="项目介绍";
  @Input() maxLength:number = 200;
  @Input() disabled:boolean = false;

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

    if(!AppUtils.isNullOrWhiteSpace(name) && name.length > this.maxLength){
      this.zmPass = false;
      this.errorMsg = this.label + "最大长度为"+this.maxLength+"个字符";
    }else{
      this.zmPass = true;
      this.errorMsg = "";
    }
    //通知外部 value做了检查
    this.valueChecked.emit();
  }
}


