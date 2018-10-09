import {SimpleOrderInfo} from "./SimpleOrderInfo";
import {SimpleLeaguerInfo} from "./SimpleLeaguerInfo";
import {PayItem} from "../../order/data/PayItem";
import {OrderRemark} from "./OrderRemark";
import {ChargeBackDetail} from "./ChargeBackDetail";
import {DonateDetail} from "./DonateDetail";
import {BuyDetail} from "./BuyDetail";
import {DelimitCardDetail} from "./DelimitCardDetail";
import {OrderBonusDetail} from "../../order/data/OrderBonusDetail";
import {RechargeDetail} from "./RechargeDetail";
import {OrderTrack} from "../../orderTrack/data/OrderTrack";

export class OrderDetail {
  constructor() {
  }

  simpleOrderInfo: SimpleOrderInfo;
  simpleLeaguerInfo: SimpleLeaguerInfo;
  rechargeDetails:Array<RechargeDetail>;
  delimitCardDetails: Array<DelimitCardDetail>;
  buyDetails: Array<BuyDetail>;
  donateDetails: Array<DonateDetail>;
  chargeBackDetails: Array<ChargeBackDetail>;
  orderRemark: OrderRemark;
  payItems: Array<PayItem>;
  orderBonusDetails: Array<OrderBonusDetail>;
  orderTrack: OrderTrack;//物流信息
}
