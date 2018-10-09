import {Component, Input, OnInit, OnChanges} from '@angular/core';
import 'rxjs/add/operator/switchMap';
import {AppUtils} from "../../../comModule/AppUtils";


/**
 * 数字输入框共用组件
 *
 */

@Component({
  selector: 'numberInput-comp',
  inputs: ['form'],
  template: `
      <div class="">
        <div class="input-group form-group" style="align-items: center;" >
        <label class="text-right"  style="font-size: 1rem;margin-bottom: 0;width: 100px;margin-right: 10px;"><span class="font-c3">*</span>{{text}}</label>
        <input type="number" [ngClass]="{'form-valid-error':number.invalid && (number.touched)}"  style="border-width:2px;border-radius:0.375rem;padding-left: 30px; padding-right: 30px;" class="form-control" required placeholder="请输入{{text}}" name="number" #number ="ngModel" [(ngModel)] = "price" (blur) ="subNum(price)"/>
        <i *ngIf="type==1" class="fa fa-yen pos-a" style="    left: 120px;z-index:3;font-size: 14px; color: #DADFE6;"></i>
        <span *ngIf="type==2" class=" pos-a" style=" right:15px;z-index: 3;font-size: 14px; color: #DADFE6;">%</span>
        </div>
        <div  class="c-input-error" style=" height: 30px; font-size: 12px; color: red;margin-left: 115px;">
          <div  class="text-danger"    *ngIf="number.invalid && (number.touched)">
            <div *ngIf="number.errors.required">
              {{text}}不能为空
            </div>
         </div>
        </div>
       </div>
      `,
  styles:[`
  .c-form-control{ 
      border-bottom-left-radius:0 !important;
      border-top-left-radius:0 !important;
      line-height:48px;
      height:48px;
      padding: 0 0.75rem;
      }
      `],
})
export class FormatNumberComp implements OnInit,OnChanges{

  public price:number;

  @Input() form:any;//表单名
  @Input() pName:string;//属性名
  @Input() text:string;//文字
  @Input() type:number;//类型 1.金额￥ 2.折扣%

  @Input() myForm:any;


  constructor() {
  }

  ngOnInit(){
    this.initData();
  }

  ngOnChanges(){
    this.initData();
  }


  private initData():void{
    this.price = this.form[this.pName];
  }


  subNum(number){
    let tmp = AppUtils.formatNum(number);
    this.price = tmp;
    if(!AppUtils.isNumber2(this.price.toString())) {
      this.form[this.pName] = null;
      this.price = null;
    }else{
      if(this.price<0 || this.price>99999999){
        this.form[this.pName] = null;
        this.price = null;
      }
      this.form[this.pName] = this.price;
    }


  }

}

