import {PipeTransform, Pipe} from "@angular/core";
import {ChargeChannelEnum} from "../../../bsModule/charge/data/ChargeChannelEnum";

@Pipe({name:"chargeChannelPipe"})
export class ChargeChannelPipe implements PipeTransform{
  transform(payType: number): string {
    if(payType == ChargeChannelEnum.CASH){
      return "现金";
    }else if(payType == ChargeChannelEnum.ALIPAY){
      return "支付宝";
    }else if(payType == ChargeChannelEnum.WECHAT){
      return "微信";
    }else if(payType == ChargeChannelEnum.UNION_PAY){
      return "银联";
    }else{
      return "-";
    }
  }
}
