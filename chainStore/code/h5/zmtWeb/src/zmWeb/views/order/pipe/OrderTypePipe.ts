import {PipeTransform, Pipe} from "@angular/core";
import {OrderTypeEnum} from "../../../bsModule/order/data/OrderTypeEnum";

@Pipe({name:"orderTypePipe"})
export class OrderTypePipe implements PipeTransform{
  transform(orderType: number): string {
    if(orderType){
      if(orderType == OrderTypeEnum.PURCHASE){
        return "开单收银";
      }else if(orderType == OrderTypeEnum.RECHARGE){
        return "会员充值";
      }
    }else{
      return "-";
    }

  }
}
