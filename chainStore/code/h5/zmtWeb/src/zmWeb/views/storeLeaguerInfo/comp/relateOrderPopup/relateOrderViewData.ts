import {PayItem} from "../../../../bsModule/order/data/PayItem";
import {BuyItem} from "../../../../bsModule/order/data/BuyItem";
import {DelimitCardItem} from "../../../../bsModule/order/data/DelimitCardItem";
import {DonationItem} from "../../../../bsModule/order/data/DonationItem";
import {Order} from "../../../../bsModule/order/data/Order";
import {AppUtils, ZmMap} from "../../../../comModule/AppUtils";
import {OrderQueryForm} from "../../../../bsModule/order/apiData/OrderQueryForm";
import {BUser} from "../../../../bsModule/buser/apiData/BUser";
import {ProductInfo} from "../../../../bsModule/StoreProductInfo/data/ProductInfo";
import {Goods} from "../../../../bsModule/storeGoods/data/Goods";
import {ProductCard} from "../../../../bsModule/storeCardInfo/data/ProductCard";
import {PackageProject} from "../../../../bsModule/storePackageProject/data/PackageProject";
import {SimpleBuyItem} from "./simpleBuyItem";

export class RelateOrderViewData{
  public buserMap: ZmMap<BUser> = new ZmMap<BUser>();
  public productMap:ZmMap<ProductInfo> = new ZmMap<ProductInfo>();
  public goodsMap:ZmMap<Goods> = new ZmMap<Goods>();
  public cardMap:ZmMap<ProductCard> = new ZmMap<ProductCard>();
  public packageMap:ZmMap<PackageProject> = new ZmMap<PackageProject>();

  public orderQueryForm: OrderQueryForm = new OrderQueryForm();
  public orderList: Array<SimpleOrderItem> = new Array<SimpleOrderItem>();
  public curPage: number;//当前页码
  public recordCount: number;//总记录数
  public loadingFinish: boolean = false;
  public selectedOrder: SimpleOrderItem;

  //订单详情
  public selectedSimpleOrderItem: SimpleOrderItem;
  public showPageIndex:number = 0;//0:订单列表，1：订单详情
}

export class SimpleOrderItem{
  public isSelected:boolean = false;
  public id:string;
  public content:string;
  public status:number;
  public chargeBackCost:number;
  public cost:number;
  public realPay:number;
  public createdTime:number;
  public creatorName:string;
  public payItems:Array<PayItem> = new Array<PayItem>();

  public buyItems:Array<BuyItem>;
  public delimitCardItems:Array<DelimitCardItem>;
  public donationItems:Array<DonationItem>;

  public static fromOrder(order:Order):SimpleOrderItem{
    let simpleOrderItem = new SimpleOrderItem();
    simpleOrderItem.id = order.id;
    simpleOrderItem.status = order.status;
    simpleOrderItem.chargeBackCost = order.chargeBackCost;
    simpleOrderItem.cost = order.cost;
    simpleOrderItem.realPay = order.realPay;
    simpleOrderItem.createdTime = order.createdTime;
    simpleOrderItem.payItems = order.payItems;
    simpleOrderItem.delimitCardItems = order.delimitCardItems;
    simpleOrderItem.buyItems = order.buyItems;
    simpleOrderItem.donationItems = order.donationItems;
    return simpleOrderItem;
  }
}

export class PgItem{
  public pgId:string;
  public pgType:number;
  public delimitFlag:boolean = false;
  constructor(pgId:string,pgType:number,delimitFlag?:boolean){
    this.pgId = pgId;
    this.pgType = pgType;
    this.delimitFlag = AppUtils.isNullObj(delimitFlag)?false:delimitFlag;
  }
}
