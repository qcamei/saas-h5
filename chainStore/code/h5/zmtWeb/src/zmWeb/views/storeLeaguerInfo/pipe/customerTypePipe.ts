import {PipeTransform, Pipe} from "@angular/core";
import {LimitUnitEnum} from "../../../bsModule/storeLeaguerInfo/data/LimitUnitEnum";
import {CustomerTypeEnum} from "../../../bsModule/storeLeaguerInfo/data/CustomerTypeEnum";

@Pipe({name:"customerTypePipe"})
export class CustomerTypePipe implements PipeTransform{
  transform(customerType: number): string {
    if(customerType == CustomerTypeEnum.UNKONW){
      return "未知会员";
    }else if(customerType == CustomerTypeEnum.HIGH_GRADE_CUSTOMER){
      return "优质会员";
    }else if(customerType == CustomerTypeEnum.RISK_CUSTOMER){
      return "风险会员";
    }else if(customerType == CustomerTypeEnum.QUIESCENCE_CUSTOMER){
      return "静止会员";
    }
  }
}
