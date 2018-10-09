import {PipeTransform, Pipe} from "@angular/core";
import {OrderStatusEnum} from "../../../bsModule/order/data/OrderStatusEnum";

@Pipe({name:"orderStatusPipe"})
export class OrderStatusPipe implements PipeTransform{
  transform(status: number): string {
    if(status == OrderStatusEnum.NOT_PAY){
      return "待收款";
    }else if(status == OrderStatusEnum.HAS_PAY){
      return "已收款";
    }else if(status == OrderStatusEnum.CANCEL){
      return "已取消";
    }else if(status == OrderStatusEnum.CHARGEBACK_ALL){
      return "已退单";
    }else if(status == OrderStatusEnum.CHARGEBACK_PART){
      return "部分退单";
    }else{
      return "-";
    }
  }
}

@Pipe({name:"rechargeStatusPipe"})
export class RechargeStatusPipe implements PipeTransform{
  transform(status: number): string {
    if(status == OrderStatusEnum.NOT_PAY){
      return "待收款";
    }else if(status == OrderStatusEnum.HAS_PAY){
      return "已收款";
    }else if(status == OrderStatusEnum.CANCEL){
      return "已取消";
    }else if(status == OrderStatusEnum.CHARGEBACK_ALL){
      return "已撤销";
    }else if(status == OrderStatusEnum.CHARGEBACK_PART){
      return "部分退单";
    }else{
      return "-";
    }
  }
}
