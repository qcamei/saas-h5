import {PipeTransform, Pipe} from "@angular/core";
import {ChargeTypeEnum} from "../../../bsModule/charge/data/ChargeTypeEnum";

@Pipe({name:"chargeTypePipe"})
export class ChargeTypePipe implements PipeTransform{
  transform(type: number): string {
    if(type == ChargeTypeEnum.RENEW){
      return "续费";
    }else if(type == ChargeTypeEnum.UPGRADE){
      return "升级";
    }else{
      return "普通";
    }
  }
}
