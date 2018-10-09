import {PipeTransform, Pipe} from "@angular/core";
import {ZmMap} from "../../../comModule/AppUtils";
import {Leaguer} from "../../../bsModule/storeLeaguerInfo/data/Leaguer";
/**
 * 会员ID -->会员名字 转换管道
 * @param leaguerId: number
 * @param leaguerMap:ZmMap<Leaguer>
 * 使用 {{leaguerId|leaguerNamePipe:leaguerMap}}
 */
@Pipe({ name: 'leaguerNamePipe' })
export class LeaguerNamePipe implements PipeTransform {

  transform(leaguerId:string,leaguerMap:ZmMap<Leaguer>) {
    let leaguer = leaguerMap.get(leaguerId) ;
    return leaguer.name;
  }
}
