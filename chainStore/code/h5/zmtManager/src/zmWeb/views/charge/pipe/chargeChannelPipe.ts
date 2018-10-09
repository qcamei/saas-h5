import {Pipe, PipeTransform} from "@angular/core";
import {ChargeChannelEnum} from "../../../bsModule/charge/data/ChargeChannelEnum";

@Pipe({name: 'chargeChannelPipe'})
export class ChargeChannelPipe implements PipeTransform {
  transform(chargeChannel:number): string {
    let result = "-";
    if(chargeChannel == ChargeChannelEnum.CASH){
      result = "现金";
    }else if(chargeChannel == ChargeChannelEnum.ALIPAY) {
      result = "支付宝";
    }else if(chargeChannel == ChargeChannelEnum.WECHAT) {
      result = "微信";
    }else if(chargeChannel == ChargeChannelEnum.UNION_PAY) {
      result = "银联";
    }
    return result;
  }
}
