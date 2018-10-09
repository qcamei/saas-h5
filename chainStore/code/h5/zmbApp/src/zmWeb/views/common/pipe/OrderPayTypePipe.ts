import {PipeTransform, Pipe} from "@angular/core";
import {PayTypeEnum} from "../../../bsModule/order/data/PayTypeEnum";

@Pipe({name:"orderPayTypePipe"})
export class OrderPayTypePipe implements PipeTransform{
  transform(payType: number): string {
    if(payType == PayTypeEnum.CASH){
      return "现金";
    }else if(payType == PayTypeEnum.ALIPAY){
      return "支付宝";
    }else if(payType == PayTypeEnum.WECHAT){
      return "微信";
    }else if(payType == PayTypeEnum.SLOT_CARD){
      return "刷卡";
    }else if(payType == PayTypeEnum.MEMBERSHIPCARD){
      return "会员卡";
    }else if(payType == PayTypeEnum.ARREARAGE){
      return "欠款";
    }else{
      return "-";
    }
  }
}
