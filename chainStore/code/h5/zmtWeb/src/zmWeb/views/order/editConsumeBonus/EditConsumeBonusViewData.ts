import {StaffData} from "../../storeflow/selectStaffComp/selectStaffComp";
import {PrdCardPayEnum} from "../../../bsModule/workFlow/data/PrdCardPayEnum";
import {DonateDetail} from "../../../bsModule/orderDetail/data/DonateDetail";
import {ProductCardItemEnum} from "../../../bsModule/productCardDetail/data/ProductCardItemEnum";
import {DelimitCardDetail} from "../../../bsModule/orderDetail/data/DelimitCardDetail";
import {BuyDetail} from "../../../bsModule/orderDetail/data/BuyDetail";
import {BonusDetail} from "../../../bsModule/orderDetail/data/BonusDetail";
import {SimpleOrderInfo} from "../../../bsModule/orderDetail/data/SimpleOrderInfo";
import {OrderDetail} from "../../../bsModule/orderDetail/data/OrderDetail";
import {BonusRecordQueryForm} from "../../../bsModule/bonusRecord/apiData/BonusRecordQueryForm";
import {ZmMap} from "../../../comModule/AppUtils";
import {ClerkInfo} from "../../../bsModule/storeClerkInfo/data/ClerkInfo";
import {StoreAdminRole} from "../../../bsModule/storeClerkInfo/data/storeAdminRole/StoreAdminRole";
import {BUser} from "../../../bsModule/buser/apiData/BUser";
import {OrderBonusDetail} from "../../../bsModule/order/data/OrderBonusDetail";
import {UserBonusDetail} from "../../../bsModule/order/data/UserBonusDetail";

export class EditConsumeBonusViewData {

  public clerkMap: ZmMap<ClerkInfo>;
  public roleMap: ZmMap<StoreAdminRole>;
  public buserMap: ZmMap<BUser>;

  //查询参数
  public queryForm: BonusRecordQueryForm = new BonusRecordQueryForm();

  //服务提成列表
  public orderBonusList: Array<OrderBonusData> = new Array<OrderBonusData>();
  public creatorName: string = "-";//跟进人员

  public orderDetail: OrderDetail = new OrderDetail();
  public simpleOrderInfo: SimpleOrderInfo = new SimpleOrderInfo();
  public delimitCardDetails: Array<DelimitCardDetail> = new Array<DelimitCardDetail>();
  public buyDetails: Array<BuyDetail> = new Array<BuyDetail>();
  public buyDetailsTotalPrice: number = 0;
  public donateDetails: Array<DonateDetail> = new Array<DonateDetail>();
  public bonusDetails: Array<OrderBonusDetail> = new Array<OrderBonusDetail>();
}

//服务提成组装
export class OrderBonusData {

  public pgId: string;
  public pgName: string;
  public amount: number;//应结
  public buyType: number;//类型  BuyTypeEnum
  public payType: number;//结算方式 PrdCardPayEnum
  public staffBonusList: Array<StaffData> = new Array<StaffData>();//对应服务人员提成
  public staffName: string;//对应服务人员名称
  public leaguerPrdCardId: string;

  public static fromBuyDetail(buyDetail: BuyDetail): OrderBonusData {
    let orderBonusData = new OrderBonusData();
    orderBonusData.pgId = buyDetail.pgId;
    orderBonusData.pgName = buyDetail.pgName;
    orderBonusData.buyType = buyDetail.buyType;
    orderBonusData.amount = buyDetail.pay;
    orderBonusData.payType = PrdCardPayEnum.CashPay;
    return orderBonusData;
  }

  public static fromDelimitCardDetail(delimitCardDetail: DelimitCardDetail): OrderBonusData {
    let orderBonusData = new OrderBonusData();
    orderBonusData.pgId = delimitCardDetail.pgId;
    orderBonusData.pgName = delimitCardDetail.pgName;

    //ProductCardItemEnum->BuyTypeEnum
    let type = parseInt(delimitCardDetail.itemType.toString()) + 1;
    if (delimitCardDetail.itemType == ProductCardItemEnum.PACKAGE) {
      type = parseInt(delimitCardDetail.itemType.toString()) + 2;
    }

    orderBonusData.buyType = type;
    orderBonusData.amount = delimitCardDetail.price;
    orderBonusData.leaguerPrdCardId = delimitCardDetail.leaguerPrdCardId;
    orderBonusData.payType = PrdCardPayEnum.PrdCard;
    return orderBonusData;
  }

  public static fromDonateDetail(donateDetail: DonateDetail): OrderBonusData {
    let orderBonusData = new OrderBonusData();
    orderBonusData.pgId = donateDetail.pgId;
    orderBonusData.pgName = donateDetail.pgName;
    orderBonusData.buyType = donateDetail.buyType;
    orderBonusData.amount = donateDetail.price;
    orderBonusData.payType = PrdCardPayEnum.Donation;
    return orderBonusData;
  }
}
export class BonusInfo{
  staffBonusList:Array<StaffData> = new Array<StaffData>();//对应服务人员提成
  staffName: string;//对应服务人员名称
}
