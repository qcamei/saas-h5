import {PipeTransform, Pipe} from "@angular/core";
import {OrderOriginEnum} from "../../../bsModule/order/data/OrderOriginEnum";

@Pipe({name:"zmOrderOriginPipe"})
export class ZmOrderOriginPipe implements PipeTransform{
  transform(origin: number): string {
    if(origin == OrderOriginEnum.BUSINESS){
      return "店铺开单";
    }else if(origin == OrderOriginEnum.CUSTOMER){
      return "客户下单";
    }else{
      return "-";
    }
  }
}
