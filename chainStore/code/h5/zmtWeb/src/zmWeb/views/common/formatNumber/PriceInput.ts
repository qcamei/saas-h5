import {Directive, ElementRef, HostListener} from '@angular/core';
import {AppUtils} from "../../../comModule/AppUtils";


@Directive({
  selector: '[priceInput]'
})
export class PriceInput {
  constructor(private el: ElementRef) {

  }

  //keyup blur mouseleave  mouseenter
  @HostListener('keyup') mouseleave() {
    let value = this.el.nativeElement.value;
    if(!AppUtils.isNumber(value.toString())) {
      this.el.nativeElement.value = null;
    }else{
      let valideValue = this.validateValue(value);
      this.el.nativeElement.value = valideValue;
    }
  }

  private validateValue(value) {
      value = AppUtils.roundPoint(value,2);
      if(value<0 || value>99999999){
          value = null;
      }
    return value;
  }
}







