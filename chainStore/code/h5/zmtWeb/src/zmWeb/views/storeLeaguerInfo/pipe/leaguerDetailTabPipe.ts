import {PipeTransform, Pipe} from "@angular/core";
import {LimitUnitEnum} from "../../../bsModule/storeLeaguerInfo/data/LimitUnitEnum";
import {CustomerTypeEnum} from "../../../bsModule/storeLeaguerInfo/data/CustomerTypeEnum";
import {ZmMap} from "../../../comModule/AppUtils";
import {LeaguerOriginConfig} from "../../../bsModule/storeConfig/data/leaguer/LeaguerOriginConfig";

@Pipe({name:"leaguerDetailTabPipe"})
export class LeaguerDetailTabPipe implements PipeTransform{
  transform(tabIndex: number): string {
    if(tabIndex == 0){
      return "会员信息";
    }else if(tabIndex == 1){
      return "跟进记录";
    }else if(tabIndex == 2){
      return "订单记录";
    }else if(tabIndex == 3){
      return "次卡详情";
    }else if(tabIndex == 4){
      return "未消费项目";
    }else{
      return "会员信息";
    }
  }
}
