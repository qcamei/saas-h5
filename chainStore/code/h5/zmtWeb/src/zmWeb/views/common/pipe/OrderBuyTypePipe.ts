import {PipeTransform, Pipe} from "@angular/core";
import {BuyTypeEnum} from "../../../bsModule/order/data/BuyTypeEnum";

//购买类型
@Pipe({name:"orderBuyTypePipe"})
export class OrderBuyTypePipe implements PipeTransform{
  transform(buyType: number): string {
    if(buyType == BuyTypeEnum.PRDCARD){
      return "次卡";
    }else if(buyType == BuyTypeEnum.PRODUCT){
      return "项目";
    }else if(buyType == BuyTypeEnum.GOODS){
      return "商品";
    }else if(buyType == BuyTypeEnum.RECHARGE){
      return "充值";
    }else if(buyType == BuyTypeEnum.PACKAGE){
      return "套餐";
    }else{
      return "-";
    }
  }
}
