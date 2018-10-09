import {Pipe, PipeTransform} from "@angular/core";
import {BonusTypeEnum} from "../../../bsModule/bonusRecord/data/BonusTypeEnum";

@Pipe({name:"bonusTypePipeComp"})
export class BonusTypePipeComp implements PipeTransform{

  transform(bonusType: number): string {
    if(bonusType == BonusTypeEnum.FixedBonus){
      return "固定提成";
    }else if(bonusType == BonusTypeEnum.PercentBonus){
      return "比例提成";
    }else{
      return "未知";
    }
  }
}
