import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name:"orderLimitUnitPipe"})
export class OrderLimitUnitPipe implements PipeTransform{
  transform(unit: number): string {
    if(unit == 0){
      return "";
    }else if(unit == 1){
      return "天";
    }else if(unit == 2){
      return "月";
    }else if(unit == 3){
      return "年";
    }
  }
}
