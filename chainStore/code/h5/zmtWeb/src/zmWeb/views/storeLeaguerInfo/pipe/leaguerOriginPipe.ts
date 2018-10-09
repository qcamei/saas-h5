import {PipeTransform, Pipe} from "@angular/core";
import {LimitUnitEnum} from "../../../bsModule/storeLeaguerInfo/data/LimitUnitEnum";
import {CustomerTypeEnum} from "../../../bsModule/storeLeaguerInfo/data/CustomerTypeEnum";
import {ZmMap} from "../../../comModule/AppUtils";
import {LeaguerOriginConfig} from "../../../bsModule/storeConfig/data/leaguer/LeaguerOriginConfig";

@Pipe({name:"leaguerOriginPipe"})
export class LeaguerOriginPipe implements PipeTransform{
  transform(originId: string,leaguerOriginConfigMap:ZmMap<LeaguerOriginConfig>): string {
    return leaguerOriginConfigMap.get(originId)?leaguerOriginConfigMap.get(originId).originName:"";
  }
}
