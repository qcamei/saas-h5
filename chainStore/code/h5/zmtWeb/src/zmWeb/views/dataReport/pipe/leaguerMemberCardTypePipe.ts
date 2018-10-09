import {PipeTransform, Pipe} from "@angular/core";
import {ZmMap} from "../../../comModule/AppUtils";
import {MembershipCard} from "../../../bsModule/storeCardInfo/data/MembershipCard";

@Pipe({name:"leaguerMemberCardTypePipe"})
export class LeaguerMemberCardTypePipe implements PipeTransform{
  transform(cardId: string,memberCardMap:ZmMap<MembershipCard>): string {
    return memberCardMap.get(cardId)?memberCardMap.get(cardId).name:'-';
  }
}
