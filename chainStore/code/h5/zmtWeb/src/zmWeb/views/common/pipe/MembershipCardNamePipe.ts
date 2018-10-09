import {Pipe, PipeTransform} from "@angular/core";
import {ZmMap} from "../../../comModule/AppUtils";
import {MembershipCard} from "../../../bsModule/storeCardInfo/data/MembershipCard";

@Pipe({name: 'membershipCardNamePipe'})
export class MembershipCardNamePipe implements PipeTransform {

  transform(id: number, membershipCardMap: ZmMap<MembershipCard>) {
    let name:string = "-";
    if(id && membershipCardMap){
      name = membershipCardMap.get(id.toString())?membershipCardMap.get(id.toString()).name:name;
    }
    return name;
  }
}
