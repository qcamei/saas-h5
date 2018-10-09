import {Pipe, PipeTransform} from "@angular/core";
import {AppUtils} from "../../../comModule/AppUtils";

@Pipe({name:"moneyF2YPipe"})
export class MoneyF2YPipe implements PipeTransform{
  constructor(){}

  transform(moneyF:number) {
    if(moneyF==null){
      return '-';
    }else{
      return AppUtils.moneyF2Y(moneyF);
    }
  }
}
