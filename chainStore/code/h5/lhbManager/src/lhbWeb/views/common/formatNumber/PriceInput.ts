import {Directive, ElementRef, Input, HostListener} from '@angular/core';
import {AppUtils} from "../../../comModule/AppUtils";


@Directive({
  selector: '[priceInput]'
})
export class PriceInput {
  constructor(private el: ElementRef) {

  }

  //keyup blur mouseleave  mouseenter
  @HostListener('blur') mouseleave() {
    let value = this.el.nativeElement.value;
    if(value == ""){
      this.el.nativeElement.value = null;
    }else{
      let valideValue = this.validateValue(value);
      this.el.nativeElement.value = valideValue;
    }
  }

  private validateValue(value) {
    value = AppUtils.twoDecimal(value);
    if(!AppUtils.isNumber2(value.toString())) {
      value = null;
    }else{
      if(value<0 || value>99999999){
        value = null;
      }
    }
    return value;
  }
}







