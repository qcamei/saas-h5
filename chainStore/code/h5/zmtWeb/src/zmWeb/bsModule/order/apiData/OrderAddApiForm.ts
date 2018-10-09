import {BuyItem} from "../data/BuyItem";
import {RechargeItem} from "../data/RechargeItem";
import {DelimitCardItem} from "../data/DelimitCardItem";
import {DonationItem} from "../data/DonationItem";
import {PreStoreCardItem} from "../data/PreStoreCardItem";

export class OrderAddApiForm {
  orderType: number;//OrderTypeEnum
  leaguerId: string;
  name: string;
  cost: number;
  rechargeItems: Array<RechargeItem>;
  buyItems: Array<BuyItem>;
  delimitCardItems: Array<DelimitCardItem>;
  preStoreCardItems:Array<PreStoreCardItem>;// 预存卡消费清单
  donationItems: Array<DonationItem>;
  storeId: string;
  creatorId: string;

  constructor() {
  }
}
