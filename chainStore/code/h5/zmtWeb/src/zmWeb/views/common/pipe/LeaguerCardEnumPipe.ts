import {PipeTransform, Pipe} from "@angular/core";
import {ProductCardTypeEnum} from "../../../bsModule/storeCardInfo/data/ProductCardTypeEnum";
import {LeaguerCardEnum} from "../../../bsModule/storeLeaguerInfo/data/LeaguerCardEnum";

@Pipe({name:"leaguerCardEnumPipe"})
export class LeaguerCardEnumPipe implements PipeTransform{

  transform(state: number): string {
    if(state == LeaguerCardEnum.VALID){
      return "有效";
    }else if(state == LeaguerCardEnum.INVALID){
      return "失效";
    }else if(state == LeaguerCardEnum.NOTUSE){
      return "未使用";
    }else if(state == LeaguerCardEnum.USING){
      return "使用中";
    }else if(state == LeaguerCardEnum.FINISH){
      return "已完成";
    }else if(state == LeaguerCardEnum.BACKCARD){
      return "已退卡";
    }
  }
}
