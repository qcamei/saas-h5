import {RechargeItem} from "./RechargeItem";
import {BuyItem} from "./BuyItem";
import {DelimitCardItem} from "./DelimitCardItem";
import {DonationItem} from "./DonationItem";
import {PayItem} from "./PayItem";
import {PreStoreCardItem} from "./PreStoreCardItem";
export class Order {
  constructor() {
  }

  id: string;
  number: string;
  orderType: number;
  leaguerId: string;
  cost: number;
  realPay: number;
  status: number;
  entityState: number;
  createdTime: number;
  payTime: number;
  chargeBackCost: number;
  rechargeItems: Array<RechargeItem>;
  buyItems: Array<BuyItem>;
  delimitCardItems: Array<DelimitCardItem>;
  preStoreCardItems: Array<PreStoreCardItem>;
  donationItems: Array<DonationItem>;
  payItems: Array<PayItem>;
  name: string;
  storeId: number;
  creatorId: number;
  workFlowDataId: number;
  recordType: number;//OrderDataTypeEnum
  origin: number;//OrderOriginEnum
  lastUpdateTime: number;
  ver: number;


}
