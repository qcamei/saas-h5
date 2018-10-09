import {Pipe, PipeTransform} from "@angular/core";
import {BonusTypeEnum} from "../../../bsModule/bonusRecord/data/BonusTypeEnum";
import {BuyTypeEnum} from "../../../bsModule/order/data/BuyTypeEnum";

@Pipe({name:"itemTypePipeComp"})
export class ItemTypePipeComp implements PipeTransform{

  transform(buyType: number): string {
    if(buyType == BuyTypeEnum.GOODS){
      return "商品";
    }else if(buyType == BuyTypeEnum.PRDCARD){
      return "次卡";
    }else if(buyType == BuyTypeEnum.PRODUCT){
      return "项目";
    }else if(buyType == BuyTypeEnum.RECHARGE){
      return "会员充值";
    }else{
      return "未知";
    }
  }
}
