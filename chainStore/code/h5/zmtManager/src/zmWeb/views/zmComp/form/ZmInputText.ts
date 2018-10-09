import {Component, Input, Output, EventEmitter} from "@angular/core";
import {AppUtils} from "../../../comModule/AppUtils";
/**
 * Created by sunbirdjob on 2018/2/23.
 * 必填文本输入框  maxlength="50"
 * <zm_input_text [placeholder]=" 默认值 "  [(zmValue)]="target.value" [(validateItem)]="validateItem"></zm_input_text>
 */

@Component({
  selector:'zm_input_text',
  template: `
          <div class="form-group row mb-0">
            <label class="col-md-2 col-form-label text-center px-0"><span class="text-danger">*</span>{{label}}</label>
            <div class="col-md-10">
            <input type="text" placeholder="{{placeholder}}" maxlength="20"  class="form-control"  name="number" #number="ngModel" required 
            [ngClass]="{'form-valid-error':number.invalid && (number.touched)}" 
            [(ngModel)]="zmValue" (blur)="checkText()">
            </div>
          </div>

          <div class="row" style="height:30px;font-size:14px;">
          <div class="col-md-2"></div>
              <div class="col-md-10 text-danger" *ngIf="isExistNumber==true">编号已存在</div>
              <div class="col-md-10 text-danger">
                <div  *ngIf="number.invalid && (number.touched)">
                  <div *ngIf="number.errors.required">
                  {{errorMsg}}
                  </div>
                </div>
              </div>
            </div> 

             <!-- <div class="disFlex align-center">
                    <label class="c-input-label">{{label}}</label>
                    <input type="text" placeholder="{{placeholder}}" [ngClass]="{'form-valid-error':active && !zmPass}" maxlength="50"  class="c-input " name="text"  required [(ngModel)]="zmValue" (blur)="checkText()"/>
              </div>
    
              <div class="c-input-error">
                  <div *ngIf="!zmPass">
                      {{errorMsg}}
                  </div>
             </div>  -->
            `,
  styles:[`
 
`]
})

export class ZmInputText{
  isExistNumber:boolean = false;
  @Input() label: string;
  @Input() placeholder: string;

  @Output() valueChecked:EventEmitter<any> = new EventEmitter();
  errorMsg:string="";
  active:boolean=false;

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


  constructor(){

  }

  public checkText() {
    this.active = true;

    let name = this.zmValueTmp;

    if(AppUtils.isNullOrWhiteSpace(name)){
      this.zmPass = false;
      this.errorMsg = this.label+"不能为空 ";
    }else{
      this.zmPass = true;
      this.errorMsg = "";
    }
  }

}
