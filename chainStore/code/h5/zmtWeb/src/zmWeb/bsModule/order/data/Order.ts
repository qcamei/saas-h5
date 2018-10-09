import {RechargeItem} from "./RechargeItem";
import {BuyItem} from "./BuyItem";
import {PayItem} from "./PayItem";
import {DelimitCardItem} from "./DelimitCardItem";
import {DonationItem} from "./DonationItem";
import {ZmMap, AppUtils} from "../../../comModule/AppUtils";
import {IntfDetailData} from "../../../comModule/dataDetail/IntfDetailData";
import {PreStoreCardItem} from "./PreStoreCardItem";

export class Order implements IntfDetailData{
  id:string;
  number:string;
  orderType:number;//OrderTypeEnum
  leaguerId:string;
  name:string;// 会员名称
  cost:number;//应结金额
  realPay:number;
  status:number;//OrderStatusEnum
  entityState:number;
  createdTime:number;
  payTime:number;
  chargeBackCost:number;//已退金额
  rechargeItems:Array<RechargeItem>;
  buyItems:Array<BuyItem>;
  delimitCardItems:Array<DelimitCardItem>;
  preStoreCardItems:Array<PreStoreCardItem>;// 预存卡消费清单
  donationItems:Array<DonationItem>;
  payItems:Array<PayItem>;
  storeId:string;
  cuserId:number;
  creatorId:string;

  /**
   * @link{src/zmWeb/bsModule/order/data/OrderDataTypeEnum.ts}
   */
  recordType: number;//订单类型 OrderDataTypeEnum 补单、开单

  lastUpdateTime:number;
  ver:number;
  constructor(){}

  targetId(): string {
    return this.id;
  }

  public getPayItemMap():ZmMap<PayItem>{
    let payItemMap = new ZmMap<PayItem>();
    if(this.payItems){
      for(let i=0;i<this.payItems.length;i++){
        let payItem = this.payItems[i];
        payItemMap.put(this.getPayItemKey(payItem),payItem);
      }
    }
    return payItemMap;
  }

  private getPayItemKey(payItem: PayItem):string {
    return AppUtils.format('{0}_{1}', payItem.payType.toString(), payItem.outTradeNo);
  }
}

