
import {Component, Input, OnInit, OnChanges} from '@angular/core';
import 'rxjs/add/operator/switchMap';
import {AppUtils} from "../../../comModule/AppUtils";
import {ZmtFormMonitor} from "../formCheck/ZmtFormMonitor";


/**
 * 数字输入框共用组件
 *
 */

@Component({
  selector: 'moneyInput-comp',
  inputs: ['form'],
  template: `
      <div class="">
        <div class="input-group form-group" style="align-items: center;" >
      
        <label class="text-right"  style="font-size: 1rem;margin-bottom: 0;width: 100px;margin-right: 10px;"><span class="font-c3">*</span>{{text}}</label>
        <input type="number" style="border-width:2px;border-radius:0.375rem;padding-left: 30px; padding-right: 30px;" class="form-control" placeholder="请输入{{text}}" name="price" 
         [(ngModel)] = "price" (blur)="checkRange(price)"/>
        <span class=" pos-a" style=" right:15px;z-index: 3;font-size: 14px; color: #DADFE6;">%</span>
        </div>
        
      <div zmtFVField [checkType]="'required'" [zmtFormMonitor] = "zmtFormMonitor" [fName]="'cost'"  [value]="price">项目成本不能为空</div>
    
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
export class NumberInputComp implements OnInit,OnChanges{

  public price:number;

  @Input() form:any;//表单名
  @Input() pName:string;//属性名
  @Input() text:string;//文字
  @Input() zmtFormMonitor:ZmtFormMonitor;


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


  checkRange(discount){
    let tmp = AppUtils.formatNum(discount);
    this.price = tmp;
    if(!AppUtils.isNumber2(this.price+"")) {//不是数字
      this.form[this.pName] = null;
      this.price = null;
    }else{
      if(this.price <0 ||this.price > 100){
        this.form[this.pName] = null;
        this.price = null;
      }
      this.form[this.pName] = this.price;
    }
  }

}

