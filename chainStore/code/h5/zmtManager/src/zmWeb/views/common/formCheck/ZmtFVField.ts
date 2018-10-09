import {Directive, ElementRef, Input, HostListener} from '@angular/core';
import {ZmtFormMonitor} from "./ZmtFormMonitor";
import {AppUtils} from "../../../comModule/AppUtils";



@Directive({
  selector: '[zmtFVField]'
})
export class ZmtFVField{
  constructor(private el: ElementRef){
    this.show(false);

  }

  //form 字段校验，校验失败的话会记录到result对象

  //校验类型 notEmpty|phone
  @Input() zmtFormMonitor:ZmtFormMonitor;
  @Input() fName:string;
  //双向绑定form数据
  @Input() checkType:string;

  private oldValue:string;

  //双向绑定form数据
  @Input() set value( targetValue: string ) {

    let checkSuccess:boolean = this.check(this.checkType,targetValue);
    this.zmtFormMonitor.markChange(this.fName, checkSuccess);

    if(!AppUtils.isNullOrWhiteSpace(this.oldValue)){

      if(checkSuccess){
        this.show(false);
      }else{
        this.show(true);
      }
    }

    this.oldValue = targetValue;

  }

  @HostListener('keyUp') keyUp(){
    let value = this.el.nativeElement.value;

    // let valideValue = validateValue(value);
    // this.el.nativeElement.value = valideValue;
  }





  private check(checkTypeP:string, targetValue:any):boolean {
    console.info("ctype:"+this.checkType);
    console.info("targetValue:"+targetValue);
    let success = false;
    if(checkTypeP == "required"){
      success = FormChecker.isNotEmpty(targetValue);
    }else if(checkTypeP == "phone"){
      success = FormChecker.checkPhone(targetValue);
    }
    return success;
  }

  private show(flag:boolean) {
    if(flag){
      this.el.nativeElement.style.visibility = "visible";
    }else{
      this.el.nativeElement.style.visibility = "hidden";
    }
  }
}


class FormChecker{

  public static isNotEmpty(input:string):boolean {
    return !AppUtils.isNullOrWhiteSpace(input);
  }

  public static checkPhone(phoneNo:number):boolean {
    return false;
  }
}




