import {MembershipCard} from "../../../bsModule/storeCardInfo/data/MembershipCard";
import {LeaguerDetail} from "../../../bsModule/leaguerDetail/data/LeaguerDetail";
import {Store} from "../../../bsModule/store/data/Store";

export class MyMemCardViewData {

  constructor(){}

  public store:Store = new Store();
  public leaguer: LeaguerDetail = new LeaguerDetail();//当前会员
  public membershipCard: MembershipCard = new MembershipCard();//会员卡

  public loadingFinish:boolean = false;

}
