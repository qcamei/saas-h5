import {PipeTransform, Pipe} from "@angular/core";
import {BuyTypeEnum} from "../../../bsModule/workFlow/data/BuyTypeEnum";

@Pipe({name:"orderItemTypePipeComp"})
export class OrderItemTypePipeComp implements PipeTransform{

  transform(orderItemType: number): string {
    if(orderItemType == BuyTypeEnum.PRODUCT){
      return "项目";
    }else if(orderItemType == BuyTypeEnum.GOODS){
      return "商品";
    }else if(orderItemType == BuyTypeEnum.PRDCARD){
      return "次卡";
    }else if(orderItemType == BuyTypeEnum.RECHARGE){
      return "会员充值";
    }else if(orderItemType == BuyTypeEnum.PACKAGE){
      return "套餐";
    }else{
      return "-";
    }
  }
}
