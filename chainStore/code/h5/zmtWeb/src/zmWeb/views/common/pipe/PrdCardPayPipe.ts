import {PipeTransform, Pipe} from "@angular/core";
import {PayTypeEnum} from "../../../bsModule/order/data/PayTypeEnum";
import {PrdCardPayEnum} from "../../../bsModule/workFlow/data/PrdCardPayEnum";

@Pipe({name:"prdCardPayPipe"})
export class PrdCardPayPipe implements PipeTransform{
  transform(payType: number): string {
    if(payType == PrdCardPayEnum.CashPay){
      return "现结";
    }else if(payType == PrdCardPayEnum.PrdCard){
      return "划卡";
    }else if(payType == PrdCardPayEnum.Donation){
      return "赠送";
    }else{
      return "-";
    }
  }
}
