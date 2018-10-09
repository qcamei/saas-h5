import {WorkFlowData} from "../../../bsModule/workFlow/data/WorkFlowData";
import {ZmMap, AppUtils} from "../../../comModule/AppUtils";
import {BuyTypeEnum} from "../../../bsModule/workFlow/data/BuyTypeEnum";
import {Goods} from "../../../bsModule/storeGoods/data/Goods";
import {ProductCard} from "../../../bsModule/storeCardInfo/data/ProductCard";
import {WorkFlowType} from "../../../bsModule/workFlowType/data/WorkFlowType";
import {MembershipCard} from "../../../bsModule/storeCardInfo/data/MembershipCard";
import {BUser} from "../../../bsModule/buser/apiData/BUser";
import {LeaguerMemberCard} from "../../../bsModule/storeLeaguerInfo/data/LeaguerMemberCard";
import {BuyItem} from "../../../bsModule/order/data/BuyItem";
import {LeaguerDetail} from "../../../bsModule/leaguerDetail/data/LeaguerDetail";
import {ProductInfo} from "../../../bsModule/StoreProductInfo/data/ProductInfo";
import {ReduceCardItem} from "../selectReduceCardComp/selectReduceCardComp";
import {ProductCardItemEnum} from "../../../bsModule/productCardDetail/data/ProductCardItemEnum";
import {PackageProject} from "../../../bsModule/storePackageProject/data/PackageProject";
import {RecordTypeEnum} from "../../../bsModule/workFlow/data/RecordTypeEnum";
import {PayTypeEnum} from "../../../bsModule/order/data/PayTypeEnum";
import {PrdCardPayEnum} from "../../../bsModule/workFlow/data/PrdCardPayEnum";
import {DelimitCardItem} from "../../../bsModule/order/data/DelimitCardItem";
import {DonationItem} from "../../../bsModule/order/data/DonationItem";
import {Order} from "../../../bsModule/order/data/Order";
import {PayItemData} from "../../zmComp/form/zmPay/PayItemData";
import {DateWrap} from "../../zmComp/date/timeSlot/DateWrap";
import {ZmTimeData} from "../../appointment/Comp/appointTimeComp/AppointTimeComp";

export class WFDataWraper{

  constructor(typeNameP:string){
    this.setWFTypeName(typeNameP);
  }

  private _wfTypeName:string;//类型名称 用于区分开单收银、会员充值不同流程

  //后台传过来的数据，只读，不能修改
  private _workFlowData:WorkFlowData = null;
  private _workFlowType:WorkFlowType = null;
  public leaguerId:string; //选择的会员id
  public isLeaguer:boolean = false;//是否是会员 false为散客
  public number:string = '';

  //会员组件数据
  private _cuserWFCompData:CuserWFCompData = new CuserWFCompData();
  //跟进人员组件数据
  private _buserWFCompData:BuserWFCompData = new BuserWFCompData();
  //项目组件数据
  private _prodRecordsWFCompData:ProdRecordsWFCompData = new ProdRecordsWFCompData();
  //商品组件数据
  private _attachProdsWFCompData:AttachProdsWFCompData = new AttachProdsWFCompData();
  //次卡组件数据
  private _productCardWFCompData:ProductCardWFCompData = new ProductCardWFCompData();
  //提成组件数据
  private _bonusWFCompData:BonusWFCompData = new BonusWFCompData();
  //结算组件数据
  private _orderWFCompData:OrderWFCompData = new OrderWFCompData();
  //划卡组件数据
  private _delimitCardRecordsWFCompData:DelimitCardRecordsWFCompData = new DelimitCardRecordsWFCompData();
  //套餐组件数据
  private _packageWFCompData:PackageWFCompData = new PackageWFCompData();
  //赠品组件数据
  private _giftWFCompData:GiftWFCompData = new GiftWFCompData();

  //会员充值设置组件数据
  private _rechargeSettingWFCompData : RechargeSettingWFCompData = new RechargeSettingWFCompData();

  //补单相关
  public isAddOldRecord:boolean;
  public date: DateWrap;//补单日期
  public time: ZmTimeData;//补单时间

  /***************************************get && set****************************************************/
  public getGiftWFCompData(): GiftWFCompData {
    return this._giftWFCompData;
  }

  public setGiftWFCompData(value: GiftWFCompData) {
    this._giftWFCompData = value;
  }

  public getPackageWFCompData(): PackageWFCompData {
    return this._packageWFCompData;
  }

  public setPackageWFCompData(value: PackageWFCompData) {
    this._packageWFCompData = value;
  }

  public getDelimitCardRecordsWFCompData(): DelimitCardRecordsWFCompData {
    return this._delimitCardRecordsWFCompData;
  }

  public setDelimitCardRecordsWFCompData(value: DelimitCardRecordsWFCompData) {
    this._delimitCardRecordsWFCompData = value;
  }

  public getWFTypeName(): string {
    return this._wfTypeName;
  }

  public setWFTypeName(value: string) {
    this._wfTypeName = value;
  }

  public setWorkFlowData(value: WorkFlowData) {
    this._workFlowData = value;
  }

  public getWorkFlowData(): WorkFlowData {
    return this._workFlowData;
  }

  public setWorkFlowType(value: WorkFlowType) {
    this._workFlowType = value;
  }

  public getWorkFlowType(): WorkFlowType {
    return this._workFlowType;
  }

  public getCuserWFCompData(): CuserWFCompData {
    return this._cuserWFCompData;
  }

  public setCuserWFCompData(value: CuserWFCompData) {
    this._cuserWFCompData = value;
  }

  public getBuserWFCompData(): BuserWFCompData {
    return this._buserWFCompData;
  }

  public setBuserWFCompData(value: BuserWFCompData) {
    this._buserWFCompData = value;
  }

  public getProdRecordsWFCompData(): ProdRecordsWFCompData {
    return this._prodRecordsWFCompData;
  }

  public setProdRecordsWFCompData(value: ProdRecordsWFCompData) {
    this._prodRecordsWFCompData = value;
  }

  public getAttachProdsWFCompData(): AttachProdsWFCompData {
    return this._attachProdsWFCompData;
  }

  public setAttachProdsWFCompData(value: AttachProdsWFCompData) {
    this._attachProdsWFCompData = value;
  }

  public getOrderWFCompData(): OrderWFCompData {
    return this._orderWFCompData;
  }

  public setOrderWFCompData(value: OrderWFCompData) {
    this._orderWFCompData = value;
  }

  public getBonusWFCompData(): BonusWFCompData {
    return this._bonusWFCompData;
  }

  public setBonusWFCompData(value: BonusWFCompData) {
    this._bonusWFCompData = value;
  }

  public getProductCardWFCompData(): ProductCardWFCompData {
    return this._productCardWFCompData;
  }

  public setProductCardWFCompData(value: ProductCardWFCompData) {
    this._productCardWFCompData = value;
  }

  public getRechargeSettingWFCompData():RechargeSettingWFCompData {
    return this._rechargeSettingWFCompData;
  }
  public setRechargeSettingWFCompData(value:RechargeSettingWFCompData){
    this._rechargeSettingWFCompData = value;
  }

  /***************************************get && set****************************************************/

}

/***********************************************流程相关组件数据定义***************************************************/

export class CuserWFCompData{
  //选中的会员
  public selectLeaguer: LeaguerDetail;
  public leaguerMemberCard:LeaguerMemberCard;
  public memberCard:MembershipCard;
}

export class BuserWFCompData{
  //选中的跟进人员
  public selectFollowClerk:FollowClerk = new FollowClerk();
}

//对应跟进人员bean
export class FollowClerk{
  public id:string;
  public name:string;
  public phone:string;

  public static fromBuserItem(buser:BUser):FollowClerk{
    let followClerk = new FollowClerk();
    followClerk.id = buser.id;
    followClerk.name = buser.name;
    followClerk.phone = buser.phone;
    return followClerk;
  }
}

export class DelimitCardRecordsWFCompData{
  public reduceList:Array<ReduceItemData> = new Array<ReduceItemData>();//次卡划卡

  public filterList(reduceType:ReduceItemType):Array<ReduceItemData>{
    return this.reduceList.filter((item)=>{
      if(item.reductType == reduceType){
        return true;
      }else{
        return false;
      }
    })
  }
}

export class ProdRecordsWFCompData{
  public productList:Array<ProductItemData> = new Array<ProductItemData>();//项目
}

export class AttachProdsWFCompData{
  public goodsList:Array<GoodsItemData> = new Array<GoodsItemData>();//商品
}

export class ProductCardWFCompData{
  public cardList:Array<CardItemData> = new Array<CardItemData>();//次卡
}

export class PackageWFCompData{
  public packageList:Array<PackageItemData> = new Array<PackageItemData>();//套餐
}

export class GiftWFCompData{
  public productList:Array<ProductItemData> = new Array<ProductItemData>();//项目
  public goodsList:Array<GoodsItemData> = new Array<GoodsItemData>();//商品
  public cardList:Array<CardItemData> = new Array<CardItemData>();//次卡
  public packageList:Array<PackageItemData> = new Array<PackageItemData>();//套餐
}

export class OrderWFCompData{
  public order:Order;//订单
  public billList:Array<BillItemData> = new Array<BillItemData>();
  public reduceList:Array<BillItemData> = new Array<BillItemData>();
  public giftList:Array<BillItemData> = new Array<BillItemData>();

  public orderAmount: number = 0;//总价
  public disAmount:number = 0;//折扣
  public orderCost:number = 0;//应结

  public balance:number = 0;//会员卡余额
  public payList:Array<PayItemData> = new Array<PayItemData>();//支付信息
  public remark:string;//备注信息

  public hasSettled:boolean = false;//是否已经结算
  /****************************遗留字段*****************************************/
  public payData:PayData = new PayData();

  public clearPayList(isLeaguer?:boolean){
    if(!isLeaguer){
      this.payList = new Array<PayItemData>();
      this.payList.push(new PayItemData(PayTypeEnum.ALIPAY));
      this.payList.push(new PayItemData(PayTypeEnum.CASH));
      this.payList.push(new PayItemData(PayTypeEnum.SLOT_CARD));
      this.payList.push(new PayItemData(PayTypeEnum.WECHAT));
      this.remark = undefined;
    }else{
      this.payList = new Array<PayItemData>();
      this.payList.push(new PayItemData(PayTypeEnum.ALIPAY));
      this.payList.push(new PayItemData(PayTypeEnum.ARREARAGE));
      this.payList.push(new PayItemData(PayTypeEnum.CASH));
      this.payList.push(new PayItemData(PayTypeEnum.MEMBERSHIPCARD));
      this.payList.push(new PayItemData(PayTypeEnum.SLOT_CARD));
      this.payList.push(new PayItemData(PayTypeEnum.WECHAT));
      this.remark = undefined;
    }
  }
}

export class BonusWFCompData{
  public bonusList:Array<BonusItemData> = new Array<BonusItemData>();
  public bonusMap:ZmMap<BonusItemData> = new ZmMap<BonusItemData>();
}

export class SuperItemData{
  public type: number;//类型  项目1/商品2/次卡3/套餐4
  public id: string;//对应id
  public name: string;//名称
  public oldPrice: number;//原价
  public price: number;//售价
  public count: number;//数量
  public discount: number;//折扣
  public totalPrice: number;//总价
  public cost: number;//应结
  public payType: number = PrdCardPayEnum.CashPay;//结算方式 现结0/划卡1/赠送
  public recordType:RecordTypeEnum = RecordTypeEnum.Buy;//默认类型购买
  public restCount:number = 0;//预存数量
}

//划卡bean
export class ReduceItemData{
  public reductType:number = ReduceItemType.FromCard;//ReduceItemType
  public type:number;//类型  项目1/商品2/次卡3
  public itemType:number;//项目、商品、套餐
  public id:string;//对应项目/商品/次卡id
  public name:string = "-";//名称
  public price:number;//原价
  public count:number;//数量
  public payType:number = PrdCardPayEnum.PrdCard;//结算方式 现结0/划卡1/赠送
  public totalCount:number = 0;//总次数
  public restCount:number = 0;//剩余次数

  public leaguerCardId:string = "";//所属会员次卡id
  public productCardName:string = "";//所属次卡名称

  public static fromReduceCard(reduceCardItem:ReduceCardItem):ReduceItemData{
    let reduceItemData = new ReduceItemData();
    if(reduceCardItem.itemType == ProductCardItemEnum.PRODUCT){
      reduceItemData.type = BuyTypeEnum.PRODUCT;
    }else if(reduceCardItem.itemType == ProductCardItemEnum.GOODS){
      reduceItemData.type = BuyTypeEnum.GOODS;
    }else if(reduceCardItem.itemType == ProductCardItemEnum.PACKAGE){
      reduceItemData.type = BuyTypeEnum.PACKAGE;
    }
    reduceItemData.reductType = reduceCardItem.reductType;
    reduceItemData.itemType = reduceCardItem.itemType;
    reduceItemData.id = reduceCardItem.id;
    reduceItemData.name = reduceCardItem.name;
    let price = AppUtils.roundPoint(reduceCardItem.price,2);
    reduceItemData.price = price;
    reduceItemData.count = 1;
    reduceItemData.totalCount = reduceCardItem.totalCount;
    reduceItemData.restCount = reduceCardItem.restCount;
    reduceItemData.leaguerCardId = reduceCardItem.leaguerCardId;
    reduceItemData.productCardName = reduceCardItem.cardName;
    return reduceItemData;
  }
}

export enum ReduceItemType{
  FromCard = 0,//次卡划卡项
  FromPreStoreCard = 1,//预存划卡项
}

//页面显示的所选项目列表项实体bean
export class ProductItemData extends SuperItemData{
  public productCardId:string = "";//所属次卡id
  public productCardName:string = "";//所属次卡名称

  public static fromProduct(product:ProductInfo):ProductItemData{
    let productItemData = new ProductItemData();
    productItemData.type = BuyTypeEnum.PRODUCT;
    productItemData.id = product.id.toString();
    productItemData.name = product.name;
    let price = AppUtils.roundPoint(product.price,2);
    productItemData.oldPrice = price;
    productItemData.price = price;
    productItemData.count = 1;
    productItemData.discount = 10;
    productItemData.totalPrice = price;
    productItemData.cost = price;
    return productItemData;
  }

}

export class GoodsItemData extends SuperItemData{
  public static fromGoods(goods:Goods):GoodsItemData{
    let goodsItemData = new GoodsItemData();
    goodsItemData.type = BuyTypeEnum.GOODS;
    goodsItemData.id = goods.id.toString();
    goodsItemData.name = goods.name;
    let price = AppUtils.roundPoint(goods.price,2);
    goodsItemData.oldPrice = price;
    goodsItemData.price = price;
    goodsItemData.count = 1;
    goodsItemData.discount = 10;
    goodsItemData.totalPrice = price;
    goodsItemData.cost = price;
    return goodsItemData;
  }
}

export class PackageItemData extends SuperItemData{
  public static fromPackage(packageProject:PackageProject):PackageItemData{
    let packageItemData = new PackageItemData();
    packageItemData.type = BuyTypeEnum.PACKAGE;
    packageItemData.id = packageProject.id.toString();
    packageItemData.name = packageProject.name;
    let price = AppUtils.roundPoint(packageProject.sellPrice,2);
    packageItemData.oldPrice = price;
    packageItemData.price = price;
    packageItemData.count = 1;
    packageItemData.discount = 10;
    packageItemData.totalPrice = price;
    packageItemData.cost = price;
    return packageItemData;
  }
}

export class CardItemData extends SuperItemData{
  public static fromCard(productCard: ProductCard): CardItemData {
    let cardItemData = new CardItemData();
    cardItemData.type = BuyTypeEnum.PRDCARD;
    cardItemData.id = productCard.id;
    cardItemData.name = productCard.name;
    let price = AppUtils.roundPoint(productCard.sellPrice,2);
    cardItemData.oldPrice = price;
    cardItemData.price = price;
    cardItemData.count = 1;
    cardItemData.discount = 10;
    cardItemData.totalPrice = price;
    cardItemData.cost = price;
    return cardItemData;
  }
}

export class BonusItemData{
  public type:number;//类型  项目1/商品2/次卡3
  public id:string;//对应id
  public name:string;//名称
  public price:number;//价格
  public productCardId:string = "";//划卡项目次卡id
  public productCardName:string;//划卡项目次卡名称
  public payType:number;//结算方式 现结0/划卡1
  public staffName:string = "";//页面显示服务人员名称

  public staffBonusList:Array<StaffData> = new Array<StaffData>();//服务人员提成信息列表

  public static fromProductItem(productItemData:ProductItemData):BonusItemData{
    let bonusItemData = new BonusItemData();
    bonusItemData.type = productItemData.type;
    bonusItemData.id = productItemData.id;
    bonusItemData.name = productItemData.name;
    bonusItemData.price = AppUtils.roundPoint(productItemData.cost,2);
    bonusItemData.payType = productItemData.payType;
    // if(productItemData.payType == 1){//划卡
    //   bonusItemData.productCardId = productItemData.productCardId;
    //   bonusItemData.productCardName = productItemData.productCardName;
    //   bonusItemData.price = AppUtils.roundPoint(productItemData.price * productItemData.count,2);
    // }
    return bonusItemData;
  }

  public static fromGoodsItem(goodsItemData:GoodsItemData):BonusItemData{
    let bonusItemData = new BonusItemData();
    bonusItemData.type = goodsItemData.type;
    bonusItemData.id = goodsItemData.id;
    bonusItemData.name = goodsItemData.name;
    bonusItemData.price = AppUtils.roundPoint(goodsItemData.cost,2);
    bonusItemData.payType = goodsItemData.payType;
    return bonusItemData;
  }

  public static fromCardItem(cardItemData:CardItemData):BonusItemData{
    let bonusItemData = new BonusItemData();
    bonusItemData.type = cardItemData.type;
    bonusItemData.id = cardItemData.id;
    bonusItemData.name = cardItemData.name;
    bonusItemData.price = AppUtils.roundPoint(cardItemData.cost,2);
    bonusItemData.payType = cardItemData.payType;
    return bonusItemData;
  }

  public static fromPackageItem(packageItemData:PackageItemData):BonusItemData{
    let bonusItemData = new BonusItemData();
    bonusItemData.type = packageItemData.type;
    bonusItemData.id = packageItemData.id;
    bonusItemData.name = packageItemData.name;
    bonusItemData.price = AppUtils.roundPoint(packageItemData.cost,2);
    bonusItemData.payType = packageItemData.payType;
    return bonusItemData;
  }

  public static fromReduceItem(reduceItemData:ReduceItemData):BonusItemData{
    let bonusItemData = new BonusItemData();
    bonusItemData.type = reduceItemData.type;
    bonusItemData.id = reduceItemData.id;
    bonusItemData.name = reduceItemData.name;
    bonusItemData.price = AppUtils.roundPoint(reduceItemData.price,2);;
    bonusItemData.payType = reduceItemData.payType;
    bonusItemData.productCardId = reduceItemData.leaguerCardId;
    return bonusItemData;
  }

  public static fromGiftItem(giftItem:SuperItemData):BonusItemData{
    let bonusItemData = new BonusItemData();
    bonusItemData.type = giftItem.type;
    bonusItemData.id = giftItem.id;
    bonusItemData.name = giftItem.name;
    bonusItemData.price = AppUtils.roundPoint(giftItem.cost,2);
    bonusItemData.payType = giftItem.payType;
    return bonusItemData;
  }

}

export class StaffData{
  id:string;//员工id
  name:string;//员工姓名
  roleName:string;//员工岗位
  amount:number;// 业绩金额
  bonusType:number;//提成类型 BonusTypeEnum 固定提成 比例提成
  percentage:number;// 提成比例
  cost:number;// 提成金额
}

export class BillItemData{
  public type:number;//类型  项目1/商品2/次卡3
  public id:string;//对应商品id
  public name:string;//名称
  public oldPrice:number;//原价
  public price:number;//售价
  public count:number;//数量
  public discount:number;//折扣
  public totalPrice:number;//折后总价
  public cost:number;//应结
  public payType:number;//结算方式 现结0/划卡1/赠送2
  public productCardId:string = "";//卡id
  public productCardName:string = "";//所属次卡名称

  public static fromProductItem(productItemData:ProductItemData):BillItemData{
    let billItemData = new BillItemData();
    billItemData.type = productItemData.type;
    billItemData.id = productItemData.id;
    billItemData.name = productItemData.name;
    billItemData.oldPrice = productItemData.oldPrice;
    billItemData.price = productItemData.price;
    billItemData.count = productItemData.count;
    billItemData.discount = productItemData.discount;
    billItemData.totalPrice = productItemData.totalPrice;
    billItemData.cost = productItemData.cost;
    billItemData.payType = productItemData.payType;
    // if(productItemData.payType == 1){//划卡
    //   billItemData.productCardId = productItemData.productCardId;
    //   billItemData.productCardName = productItemData.productCardName;
    // }
    return billItemData;
  }

  public static fromGoodsItem(goodsItemData:GoodsItemData):BillItemData{
    let billItemData = new BillItemData();
    billItemData.type = goodsItemData.type;
    billItemData.id = goodsItemData.id;
    billItemData.name = goodsItemData.name;
    billItemData.oldPrice = goodsItemData.oldPrice;
    billItemData.price = goodsItemData.price;
    billItemData.count = goodsItemData.count;
    billItemData.discount = goodsItemData.discount;
    billItemData.totalPrice = goodsItemData.totalPrice;
    billItemData.cost = goodsItemData.cost;
    billItemData.payType = goodsItemData.payType;
    return billItemData;
  }

  public static fromCardItem(cardItemData:CardItemData):BillItemData{
    let billItemData = new BillItemData();
    billItemData.type = cardItemData.type;
    billItemData.id = cardItemData.id;
    billItemData.name = cardItemData.name;
    billItemData.oldPrice = cardItemData.oldPrice;
    billItemData.price = cardItemData.price;
    billItemData.count = cardItemData.count;
    billItemData.discount = cardItemData.discount;
    billItemData.totalPrice = cardItemData.totalPrice;
    billItemData.cost = cardItemData.cost;
    billItemData.payType = cardItemData.payType;
    return billItemData;
  }

  public static fromPackageItem(packageItemData:PackageItemData):BillItemData{
    let billItemData = new BillItemData();
    billItemData.type = packageItemData.type;
    billItemData.id = packageItemData.id;
    billItemData.name = packageItemData.name;
    billItemData.oldPrice = packageItemData.oldPrice;
    billItemData.price = packageItemData.price;
    billItemData.count = packageItemData.count;
    billItemData.discount = packageItemData.discount;
    billItemData.totalPrice = packageItemData.totalPrice;
    billItemData.cost = packageItemData.cost;
    billItemData.payType = packageItemData.payType;
    return billItemData;
  }

  public static fromReduceItem(reduceItemData:ReduceItemData):BillItemData{
    let billItemData = new BillItemData();
    billItemData.type = reduceItemData.type;
    billItemData.id = reduceItemData.id;
    billItemData.name = reduceItemData.name;
    billItemData.oldPrice = reduceItemData.price;
    billItemData.price = reduceItemData.price;
    billItemData.count = reduceItemData.count;
    billItemData.discount = 0;
    billItemData.totalPrice = 0;
    billItemData.cost = 0;
    billItemData.payType = reduceItemData.payType;
    return billItemData;
  }

  public static fromBuyItem(buyItem:BuyItem):BillItemData{
    let billItemData = new BillItemData();
    billItemData.type = buyItem.buyType;
    billItemData.id = buyItem.pgId;
    billItemData.price = buyItem.price;
    billItemData.count = buyItem.count;
    billItemData.discount = buyItem.discount;
    billItemData.totalPrice = buyItem.cost;
    billItemData.cost = buyItem.pay;
    billItemData.payType = PrdCardPayEnum.CashPay;
    return billItemData;
  }

  public static fromDelimitCardItem(delimitCardItem:DelimitCardItem):BillItemData{
    let billItemData = new BillItemData();
    if(delimitCardItem.itemType == ProductCardItemEnum.PRODUCT){
      billItemData.type = BuyTypeEnum.PRODUCT;
    }else if(delimitCardItem.itemType == ProductCardItemEnum.GOODS){
      billItemData.type = BuyTypeEnum.GOODS;
    }else if(delimitCardItem.itemType == ProductCardItemEnum.PACKAGE){
      billItemData.type = BuyTypeEnum.PACKAGE;
    }
    billItemData.id = delimitCardItem.pgId;
    billItemData.count = delimitCardItem.count;
    billItemData.payType = PrdCardPayEnum.PrdCard;
    return billItemData;
  }

  public static fromDonationItem(donationItem:DonationItem):BillItemData{
    let billItemData = new BillItemData();
    billItemData.type = donationItem.buyType;
    billItemData.id = donationItem.pgId;
    billItemData.price = donationItem.price;
    billItemData.count = donationItem.count;
    billItemData.totalPrice = donationItem.cost;
    billItemData.payType = PrdCardPayEnum.Donation;
    return billItemData;
  }

}

export class PayData{
  public cash: number;
  public alipay: number;
  public wechat: number;
  public memberCard: number;
  public slotCard: number;
  public arrears: number;//欠款
}

/***************************************会员充值相关************************************************************************************/
export class RechargeSettingWFCompData{
  rechargeOrderItemData :RechargeOrderItemData = new RechargeOrderItemData();
  //会员卡类型对象
  memberCard:MembershipCard = new MembershipCard();
  //结算单
  public cash: number;
  public alipay: number;
  public wechat: number;
  public slotCard: number;

  //适应组件传值
  public balance:number = 0;
}

//会员充值订单数据实体
export class RechargeOrderItemData{
  // 会员卡类型ID
  membershipCardId:string;
  // 会员卡类型名称
  membershipCardName:string;
  // 支付金额/也是页面的充值金额input
  pay:number;
  // 赠送金额
  largess:number = 0;
  // 实充金额
  amount:number;
  // 会员卡号
  number:string;

  limitTime:number; //有效期
  limitUnit:number = 1; //有效期单位: 年、月、天,默认显示天
  validPeriodRadio = true; //是否永久有效

  staffBonusList:Array<StaffData> = new Array<StaffData>();//对应服务人员提成
  staffName:string;//对应服务人员名称 张三、李四

  prdCardPayType :number = 0; //是否划卡结算：0现结
  buyType :number = 3; //消费购买的类型：3充值

  cardNumberValid:boolean = true;//会员卡编号是否有效

}

/*********************************流程无关************************************************/
export class OrderItemData{
  public type:number;//类型  项目1/商品2/次卡3/套餐4
  public id:string;//对应项目/商品/次卡id
  public name:string;//名称
  public oldPrice:number;//原价
  public price:number;//售价
  public count:number;//数量
  public discount:number;//折扣
  public totalPrice:number;//总价
  public cost:number;//应收
  public payType:number = PrdCardPayEnum.CashPay;//结算方式 现结0/划卡1/赠送2 PrdCardPayEnum
  // public staffBonusList:Array<StaffData> = new Array<StaffData>();//对应服务人员提成
  // public staffName:string;//对应服务人员名称 张三、李四

  public productCardId: string = "";//划卡项目卡id   不设置为""
  public productCardName:string = "";//所属次卡名称

  public static fromBuyItem(buyItem:BuyItem):OrderItemData{
    let orderItemData = new OrderItemData();
    orderItemData.type = buyItem.buyType;
    orderItemData.id = buyItem.pgId;
    orderItemData.name = buyItem.pgName;
    orderItemData.price = buyItem.price;
    orderItemData.count = buyItem.count;
    orderItemData.discount = buyItem.discount;
    orderItemData.totalPrice = buyItem.cost;
    orderItemData.cost = buyItem.pay;
    orderItemData.payType = AppUtils.isNullOrWhiteSpace(buyItem.prdCardId)?0:1;
    orderItemData.productCardId = buyItem.prdCardId;//对应次卡id
    orderItemData.productCardName = buyItem.payName;//对应次卡id
    return orderItemData;
  }
}
