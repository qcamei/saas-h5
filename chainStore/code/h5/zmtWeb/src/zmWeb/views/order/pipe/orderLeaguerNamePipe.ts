import {PipeTransform, Pipe} from "@angular/core";
import {ZmMap} from "../../../comModule/AppUtils";
import {Leaguer} from "../../../bsModule/storeLeaguerInfo/data/Leaguer";

@Pipe({name:"orderLeaguerNamePipe"})
export class OrderLeaguerNamePipe implements PipeTransform{
  transform(leaguerId: string,leaguerMap:ZmMap<Leaguer>): string {
    return leaguerMap.get(leaguerId)?leaguerMap.get(leaguerId).name:'-';
  }
}
