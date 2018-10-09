import {MembershipCard} from "../../../bsModule/storeCardInfo/data/MembershipCard";
import {LeaguerDetail} from "../../../bsModule/leaguerDetail/data/LeaguerDetail";
import {CUser} from "../../../bsModule/cuser/data/CUser";

export class MyViewData{
  public cuser: CUser = new CUser();
  public imgUrl:string = "assets/icon/user_1.png";

  public leaguer: LeaguerDetail = new LeaguerDetail();//当前会员
  public leaguerMemberCardBalance:number; //当前会员的会员卡余额
  public membershipCard: MembershipCard = new MembershipCard();//会员卡
}
