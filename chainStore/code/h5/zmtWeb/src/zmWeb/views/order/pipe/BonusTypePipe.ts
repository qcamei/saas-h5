import {PipeTransform, Pipe} from "@angular/core";
import {PayTypeEnum} from "../../../bsModule/order/data/PayTypeEnum";
import {BuyTypeEnum} from "../../../bsModule/order/data/BuyTypeEnum";
import {BonusTypeEnum} from "../../../bsModule/bonusRecord/data/BonusTypeEnum";

//提成类型

@Pipe({name:"bonusTypePipe"})
export class BonusTypePipe implements PipeTransform{
  transform(bonusType: number): string {
    if(bonusType == BonusTypeEnum.FixedBonus){
      return "固定提成";
    }else if(bonusType == BonusTypeEnum.PercentBonus){
      return "比例提成";
    }else{
      return "-";
    }
  }
}
