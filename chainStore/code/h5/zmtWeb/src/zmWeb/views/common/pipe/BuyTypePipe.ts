import {Pipe, PipeTransform} from "@angular/core";
import {BuyTypeEnum} from "../../../bsModule/order/data/BuyTypeEnum";

@Pipe({ name: 'buyTypePipe' })
export class BuyTypePipe implements PipeTransform {
  transform(type: number): string {
    if(type == BuyTypeEnum.PRODUCT){
      return "项目";
    }else if(type == BuyTypeEnum.GOODS){
      return "商品";
    }else if(type == BuyTypeEnum.PACKAGE){
      return "套餐";
    }else if(type == BuyTypeEnum.PRDCARD){
      return "次卡";
    }else if(type == BuyTypeEnum.RECHARGE){
      return "充值";
    }
  }
}
