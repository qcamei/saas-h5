import {ZmMap} from "../../../../comModule/AppUtils";
import {Leaguer} from "../../../../bsModule/storeLeaguerInfo/data/Leaguer";
import {ProductInfo} from "../../../../bsModule/StoreProductInfo/data/ProductInfo";
import {ProductType} from "../../../../bsModule/StoreProductInfo/data/ProductType";
import {Goods} from "../../../../bsModule/storeGoods/data/Goods";
import {GoodsType} from "../../../../bsModule/storeGoods/data/GoodsType";
import {ProductCard} from "../../../../bsModule/storeCardInfo/data/ProductCard";
import {PackageProject} from "../../../../bsModule/storePackageProject/data/PackageProject";
import {PackageProjectType} from "../../../../bsModule/storePackageProject/data/PackageProjectType";
import {PayItem} from "../../../../bsModule/order/data/PayItem";
import {PrdCardType} from "../../../../bsModule/storeCardInfo/data/PrdCardType";
import {ChargeBackItem} from "../../../../bsModule/orderNotes/data/ChargeBackItem";

export class ChargebackInfoViewData{

  public leaguerMap:ZmMap<Leaguer>;

  public productMap:ZmMap<ProductInfo>;
  public productTypeMap:ZmMap<ProductType>;

  public goodsMap:ZmMap<Goods>;
  public goodsTypeMap:ZmMap<GoodsType>;

  public productCardMap:ZmMap<ProductCard>;
  public productCardTypeMap:ZmMap<PrdCardType>;

  public packageProjectMap:ZmMap<PackageProject>;
  public packageProjectTypeMap:ZmMap<PackageProjectType>;

  //仅退款信息
  public orderChargeBackDataTmp: OrderChargebackData = new OrderChargebackData();
  //退款信息
  public chargeBackInfoTmp: ChargeBackInfo = new ChargeBackInfo();
  //退款方式
  public chargeBackTypeTmp: ChargeBackType = new ChargeBackType();
  //购买项列表
  public chargeBackItemDataList = new Array<ChargeBackItemData>();
  //待退款的购买项列表
  public chargeBackItemDataListSelected = new Array<ChargeBackItemData>();
  //支付明细
  public payItems = new Array<PayItem>();
  //退款明细
  public chargeBackPayItemList:Array<PayItem>;

  //退单明细
  public chargeBackItemMap:ZmMap<ChargeBackItem>;

}

//退单项数据
export class ChargeBackItemData {
  itemId: string;//购买项ID

  pgId:string;//项目 商品 次卡 套餐
  pgName:string;
  pgTypeName:string;

  type: number;//BuyTypeEnum类型
  payType:number;//PrdCardPayEnum 支付方式
  cost:number = 0;//总价
  sellPrice:number;//折后价

  totalCount:number;//总数
  refundedCount:number = 0;//已退数
  refundableCount:number;//可退数
  refundCount:number;//退货数
  refundAmount:number = 0.00;//退款金额

  checked:boolean = false;//是否选中
}


//仅退款数据
export class OrderChargebackData {
  realPay: number = 0.00;//实付
  chargeBackCost: number = 0.00;//已退金额
  amount: number = 0.00;//仅退款方式 退款金额
  checked: boolean = false;
}

//退款信息
export class ChargeBackInfo {
  refundableAmount: number = 0.00;//可退金额
  haveRefundAmount: number = 0.00;//应退金额
  refundReason: string = "";//退款原因

  beyondMsg:string = "";

}

//退款方式
export class ChargeBackType {

  withMemCard: boolean = false;
  withArrerage: boolean = false;
  otherWay: boolean = false;

  memCardAmount: number = 0.00;//会员卡退款金额
  arrerageAmount: number = 0.00;//欠款退款金额

  memCardBalance: number = 0.00;//会员卡可退金额
  arrerageBalance: number = 0.00;//欠款可退金额

  beyondMsgWithMemCard:string = "";
  beyondMsgWithArrerage:string = "";

  payType: number = 0;
  otherWayAmount: number = 0.00;//其他方式的退款金额

  beyondMsg:string = "";
}
