import {Component, Input, Output, EventEmitter} from "@angular/core";
import {AppUtils} from "../../../comModule/AppUtils";
/**
 * Created by helen on 2018/2/28.
 * 编号输入框
 *  <zm_input_number [label]=" '项目编号'" [placeholder]="'请输入项目编号'"  [numberList]="viewData.prdNumberList" [(zmValue)]="viewData.defaultNumber"></zm_input_number>
 */

@Component({
  selector:'zm_input_number',
  template: ` 
             <div class="form-group row mb-0">
                <label class="col-md-2 col-form-label text-center px-0"><span class="text-danger">*</span>{{label}}</label>
                <div class="col-md-10">
                <input type="text" placeholder="{{placeholder}}" maxlength="20"  class="form-control"  name="number" #number="ngModel" required 
                [ngClass]="{'form-valid-error':number.invalid && (number.touched)}" 
                pattern="^\\s*[\\w-]+\\s*$" [(ngModel)]="zmValue" (blur)="checkNumber()">
                </div>
              </div>
              <div class="row" style="height:30px;font-size:14px;">
              <div class="col-md-2"></div>
                  <div class="col-md-10 text-danger" *ngIf="isExitNumber==true">编号已存在</div>
                  <div class="col-md-10 text-danger">
                    <div  *ngIf="number.invalid && (number.touched)">
                      <div *ngIf="number.errors.required">
                        项目编号不能为空
                      </div>
                      <div *ngIf="number.errors.pattern">
                        请输入由数字、字母、下划线(_)、连接符(-)组成的字符串
                      </div>
                    </div>
                  </div>
                </div>   
            `,
  styles:[`
  // .c-label{
  //   width: 100px;
  //   text-align: right;
  //   margin-right: 20px;
  //   font-weight: bold;
  // }
  //   .font-c3 {
  //     color: #FF4c6a;
  //   }
   
  //   .c-input-group{
  //     align-items: center !important; 
  //   }
    
  //   .c-input-group .form-control{
  //     border-radius: 0.375rem !important;
  //   }

  //   .form-control{
  //     padding: 0.75rem 0.75rem;
  //     border: 2px solid #ced4da;
  //   }
  //   .form-control:focus{
  //     box-shadow: none;
  //   }
    
  //   .mg-b-10{
  //     margin-bottom:10px;
  //   }
  
`]

})

export class ZmInputNumber{

  @Input() label: string;
  @Input() placeholder:string;
  @Input() numberList:Array<string>;//编号列表 判断唯一

  @Output() zmValueChange = new EventEmitter();
  private valueTmp:string;

  public isExitNumber:boolean;


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

  /**number唯一性*/
  checkNumber() {
    if (!AppUtils.isNullOrWhiteSpace(this.valueTmp)) {
      let number = AppUtils.trimBlank(this.valueTmp);
      let numberList: Array<string> = this.numberList;
      if (AppUtils.arrayContains(numberList, number)) {
        this.isExitNumber = true;
      } else {
        this.isExitNumber = false;
      }
    }
  }
}
