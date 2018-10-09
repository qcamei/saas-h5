import {PipeTransform, Pipe} from "@angular/core";
import {LimitUnitEnum} from "../../../bsModule/storeLeaguerInfo/data/LimitUnitEnum";

@Pipe({name:"limitUnitPipe"})
export class LimitUnitPipe implements PipeTransform{
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
