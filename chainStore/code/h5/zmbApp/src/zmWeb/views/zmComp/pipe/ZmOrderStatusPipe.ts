import {PipeTransform, Pipe} from "@angular/core";
import {OrderStatusEnum} from "../../../bsModule/order/data/OrderStatusEnum";

@Pipe({name:"zmOrderStatusPipe"})
export class ZmOrderStatusPipe implements PipeTransform{
  transform(status: number): string {
    if(status == OrderStatusEnum.NOT_PAY){
      return "待收款";
    }else if(status == OrderStatusEnum.HAS_PAY){
      return "已收款";
    }else if(status == OrderStatusEnum.CANCEL){
      return "已取消";
    }else if(status == OrderStatusEnum.CHARGEBACK_ALL){
      return "已退款";
    }else if(status == OrderStatusEnum.CHARGEBACK_PART){
      return "部分退款";
    }else{
      return "-";
    }
  }
}
