import {PipeTransform, Pipe} from "@angular/core";
import {ChargeStatusEnum} from "../../../bsModule/charge/data/ChargeStatusEnum";

@Pipe({name:"chargeStatusPipe"})
export class ChargeStatusPipe implements PipeTransform{
  transform(payType: number): string {
    if(payType == ChargeStatusEnum.HAS_PAY){
      return "已支付";
    }else if(payType == ChargeStatusEnum.NOT_PAY){
      return "未支付";
    }else if(payType == ChargeStatusEnum.CANCEL){
      return "已取消";
    }else{
      return "-";
    }
  }
}
