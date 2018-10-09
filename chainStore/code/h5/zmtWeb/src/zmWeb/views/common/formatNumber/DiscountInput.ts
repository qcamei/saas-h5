
import {Directive, ElementRef, HostListener, Input} from '@angular/core';
import 'rxjs/add/operator/switchMap';
import {AppUtils} from "../../../comModule/AppUtils";

@Directive({
  selector: '[discountInput]'
})
export class DiscountInput {
  constructor(private el: ElementRef) {

  }

  @Input()
  valueTmp:"";


  //keyup blur mouseleave  mouseenter
  @HostListener('keyup') keyUp() {
    let value = this.el.nativeElement.value;
    if(value == ""){
      this.el.nativeElement.value = null;
    }else{
      let valideValue = this.validateValue(value);
      this.el.nativeElement.value = valideValue;
    }
  }

  private validateValue(value) {
    if(!AppUtils.isNumber(value.toString())) {
      value = null;
    }else{
      value = AppUtils.aDecimal(value);
      if(value<0 || value>10){
        value = null;
      }
    }
    return value;
  }
}

