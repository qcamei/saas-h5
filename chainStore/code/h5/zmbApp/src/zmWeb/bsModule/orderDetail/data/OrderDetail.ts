import {SimpleOrderInfo} from "./SimpleOrderInfo";
import {SimpleLeaguerInfo} from "./SimpleLeaguerInfo";
import {RechargeDetail} from "./RechargeDetail";
import {DelimitCardDetail} from "./DelimitCardDetail";
import {BuyDetail} from "./BuyDetail";
import {DonateDetail} from "./DonateDetail";
import {ChargeBackDetail} from "./ChargeBackDetail";
import {OrderRemark} from "./OrderRemark";
import {PayItem} from "../../order/data/PayItem";
import {OrderBonusDetail} from "./OrderBonusDetail";
export class OrderDetail {
  constructor() {
  }

  simpleOrderInfo: SimpleOrderInfo;
  buyDetails: Array<BuyDetail>;
  // orderTrack: OrderTrack;

  simpleLeaguerInfo: SimpleLeaguerInfo;
  rechargeDetails: Array<RechargeDetail>;
  delimitCardDetails: Array<DelimitCardDetail>;
  donateDetails: Array<DonateDetail>;
  chargeBackDetails: Array<ChargeBackDetail>;
  orderRemark: OrderRemark;
  payItems: Array<PayItem>;
  orderBonusDetails: Array<OrderBonusDetail>;

}
