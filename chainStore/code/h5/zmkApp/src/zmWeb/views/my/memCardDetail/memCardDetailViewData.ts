import {Store} from "../../../bsModule/store/data/Store";
import {LeaguerDetail} from "../../../bsModule/leaguerDetail/data/LeaguerDetail";
import {MembershipCard} from "../../../bsModule/storeCardInfo/data/MembershipCard";
import {MembershipCardDetail} from "../../../bsModule/memCardDetail/data/MembershipCardDetail";

export class MemCardDetailViewData {

  public store:Store = new Store();
  public leaguer: LeaguerDetail = new LeaguerDetail();//当前会员
  public membershipCard: MembershipCard = new MembershipCard();//会员卡

  public memCardDetail: MemCardDetail = new MemCardDetail();
}

export class MemCardDetail {
  id: string;
  name: string;
  number: string;
  imgPath:string;
  freeMoney: number;
  prodDiscount: number;
  goodsDiscount: number;
  prdCardDiscount: number;
  packagePrjDiscount: number;

  //LeaguerMemberCard
  limitTime: number;
  limitUnit: number;
  state: number;
  balance: number;
  endTime: number;//有效时间
  constructor() {
  }

  public static fromMembershipCard(memcardShip: MembershipCardDetail) {
    let target = new MemCardDetail();
    if (memcardShip) {
      target.id = memcardShip.id;
      target.name = memcardShip.name;
      target.number = memcardShip.number;
      target.imgPath = memcardShip.imgPath;
      target.freeMoney = memcardShip.freeMoney;
      target.prodDiscount = memcardShip.prodDiscount;
      target.goodsDiscount = memcardShip.goodsDiscount;
      target.prdCardDiscount = memcardShip.prdCardDiscount;
      target.packagePrjDiscount = memcardShip.packagePrjDiscount;
    }
    return target;
  }
}
