import {Pipe, PipeTransform} from "@angular/core";
import {AppUtils} from "../../../comModule/AppUtils";


@Pipe({name: 'zmDiscountPipe'})
export class ZmDiscountPipe implements PipeTransform {
  transform(discountTmp: number){
    let target = "-";
    if(discountTmp && discountTmp>=1 && discountTmp<=9){
      target = AppUtils.roundPoint(discountTmp,1)+"折";
    }
    return target;
  }
}


