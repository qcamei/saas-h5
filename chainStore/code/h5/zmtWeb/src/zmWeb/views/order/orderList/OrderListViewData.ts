import {Order} from "../../../bsModule/order/data/Order";
import {ZmMap, AppUtils} from "../../../comModule/AppUtils";
import {Leaguer} from "../../../bsModule/storeLeaguerInfo/data/Leaguer";
import {OrderQueryForm} from "../../../bsModule/order/apiData/OrderQueryForm";
import {OrderWFCompData} from "../../storeflow/wfComp/WFDataWraper";
import {RechargeItem} from "../../../bsModule/order/data/RechargeItem";
import {BuyItem} from "../../../bsModule/order/data/BuyItem";
import {DelimitCardItem} from "../../../bsModule/order/data/DelimitCardItem";
import {DonationItem} from "../../../bsModule/order/data/DonationItem";
import {PayItem} from "../../../bsModule/order/data/PayItem";
import {PreStoreCardItem} from "../../../bsModule/order/data/PreStoreCardItem";
import {Store} from "../../../bsModule/store/apiData/Store";
import {Constants} from "../../common/Util/Constants";
import {MgrPool} from "../../../comModule/MgrPool";
import {TimeSlot} from "../../zmComp/date/timeSlot/TimeSlot";

export class OrderListViewData {

  public orderWFCompData:OrderWFCompData = new OrderWFCompData();//订单支付
  public leaguerMap:ZmMap<Leaguer>;

  public orderQueryForm:OrderQueryForm = new OrderQueryForm();
  public status:string = "0";
  public orderList: Array<OrderVD> = new Array<OrderVD>();

  public timeSlot: TimeSlot;//时间段
  public itemActiveIndex: number = 2;//默认选中的下标

  public curPage: number = 1;//当前页码
  public recordCount: number;//总记录数
  public loadingFinish: boolean = false;

  constructor() {
    this.orderQueryForm.status = "0";
  }
}

export class OrderVD{
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
  lastUpdateTime:number;
  ver:number;

  isLeaguer:boolean = true;

  /**
   * @link{src/zmWeb/bsModule/order/data/OrderDataTypeEnum.ts}
   */
  recordType: number;//订单类型 OrderDataTypeEnum 补单、开单


  constructor(){}

  public static fromStore(order:Order){
    let orderVD = new OrderVD();
    AppUtils.copy(orderVD,order);
    let split = orderVD.leaguerId.split("_");
    if((split[1] == Constants.LEAGUER_MALE_SUFFIX) || (split[1] == Constants.LEAGUER_FEMALE_SUFFIX)){
      orderVD.isLeaguer = false;
    }else{
      orderVD.isLeaguer = true;
    }
    return orderVD;
  }
}
