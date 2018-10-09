import {ChargebackInfoViewData, ChargeBackItemData} from "./ChargebackInfoViewData";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {StoreLeaguerInfo} from "../../../../bsModule/storeLeaguerInfo/data/StoreLeaguerInfo";
import {StoreProductInfo} from "../../../../bsModule/StoreProductInfo/data/StoreProductInfo";
import {StoreGoods} from "../../../../bsModule/storeGoods/data/StoreGoods";
import {StoreCardInfo} from "../../../../bsModule/storeCardInfo/data/StoreCardInfo";
import {StorePackageProject} from "../../../../bsModule/storePackageProject/data/StorePackageProject";
import {StoreCardInfoSynDataHolder} from "../../../../bsModule/storeCardInfo/StoreCardInfoSynDataHolder";
import {StorePackageProjectSynDataHolder} from "../../../../bsModule/storePackageProject/StorePackageProjectSynDataHolder";
import {StoreGoodsSynDataHolder} from "../../../../bsModule/storeGoods/StoreGoodsSynDataHolder";
import {StoreProductInfoSynDataHolder} from "../../../../bsModule/StoreProductInfo/StoreProductInfoSynDataHolder";
import {StoreLeaguerInfoSynDataHolder} from "../../../../bsModule/storeLeaguerInfo/StoreLeaguerInfoSynDataHolder";
import {OrderViewDataMgr} from "../../orderViewDataMgr";
import {Order} from "../../../../bsModule/order/data/Order";
import {BuyItem} from "../../../../bsModule/order/data/BuyItem";
import {DelimitCardItem} from "../../../../bsModule/order/data/DelimitCardItem";
import {DonationItem} from "../../../../bsModule/order/data/DonationItem";
import {PayItem} from "../../../../bsModule/order/data/PayItem";
import {PrdCardPayEnum} from "../../../../bsModule/workFlow/data/PrdCardPayEnum";
import {BuyTypeEnum} from "../../../../bsModule/order/data/BuyTypeEnum";
import {OrderNotes} from "../../../../bsModule/orderNotes/data/OrderNotes";
import {ChargeBackRecord} from "../../../../bsModule/orderNotes/data/ChargeBackRecord";
import {OrderNotesMgr} from "../../../../bsModule/orderNotes/OrderNotesMgr";
import {AppUtils, ZmMap} from "../../../../comModule/AppUtils";
import {PayTypeEnum} from "../../../../bsModule/order/data/PayTypeEnum";
import {ChargeBackItem} from "../../../../bsModule/orderNotes/data/ChargeBackItem";
import {ProductCardItemEnum} from "../../../../bsModule/productCardDetail/data/ProductCardItemEnum";

export class ChargebackInfoService {

  constructor(private orderNotesMgr: OrderNotesMgr,
              private orderViewDataMgr: OrderViewDataMgr,
              private storeLeaguerInfoSynDataHolder: StoreLeaguerInfoSynDataHolder,
              private storeProductInfoSynDataHolder: StoreProductInfoSynDataHolder,
              private storeGoodsSynDataHolder: StoreGoodsSynDataHolder,
              private storePackageProjectSynDataHolder: StorePackageProjectSynDataHolder,
              private storeCardInfoSynDataHolder: StoreCardInfoSynDataHolder,) {
  }


  public initViewData(order: Order): void {
    this.orderViewDataMgr.setChargebackInfoVD(new ChargebackInfoViewData());

    this.buildViewData(order, (viewDataP: ChargebackInfoViewData) => {
      this.handleViewData(viewDataP);
    });
  }

  public handleViewData(viewDataP: ChargebackInfoViewData) {
    this.orderViewDataMgr.setChargebackInfoVD(viewDataP);
  }

  public async buildViewData(order: Order, callback: (viewDataP: ChargebackInfoViewData) => void) {
    let viewDataTmp = new ChargebackInfoViewData();
    let storeId = SessionUtil.getInstance().getStoreId();
    //请求会员
    let storeLeaguerInfo: StoreLeaguerInfo = await this.storeLeaguerInfoSynDataHolder.getData(storeId);
    if (storeLeaguerInfo) {
      viewDataTmp.leaguerMap = storeLeaguerInfo.getLeaguerMap();
    }

    let storeProductInfo: StoreProductInfo = await this.storeProductInfoSynDataHolder.getData(storeId);
    if (storeProductInfo) {
      viewDataTmp.productMap = storeProductInfo.getAllProductInfoMap();
      viewDataTmp.productTypeMap = storeProductInfo.getAllProductTypeMap();
    }
    let storeGoods: StoreGoods = await this.storeGoodsSynDataHolder.getData(storeId);
    if (storeGoods) {
      viewDataTmp.goodsMap = storeGoods.getAllGoodsMap();
      viewDataTmp.goodsTypeMap = storeGoods.getGoodsTypeMap();
    }
    let storeCardInfo: StoreCardInfo = await this.storeCardInfoSynDataHolder.getData(storeId);
    if (storeCardInfo) {
      viewDataTmp.productCardMap = storeCardInfo.getProductCardMap();
      viewDataTmp.productCardTypeMap = storeCardInfo.getAllProductCardTypeMap();
    }
    let storePackageProject: StorePackageProject = await this.storePackageProjectSynDataHolder.getData(storeId);
    if (storePackageProject) {
      viewDataTmp.packageProjectMap = storePackageProject.getAllPackageProjectMap();
      viewDataTmp.packageProjectTypeMap = storePackageProject.getAllPackageTypeMap();
    }

    if (order) {
      viewDataTmp.chargeBackItemMap = await this.getChargeBackItemMap(order.id);

      viewDataTmp.chargeBackItemDataList = await this.buildChargeBackItemList(order, viewDataTmp);
      viewDataTmp.payItems = order.payItems;
      viewDataTmp.chargeBackPayItemList = await this.buildChargeBackPayItemList(order);

      viewDataTmp.chargeBackInfoTmp.refundableAmount = order.realPay - order.chargeBackCost;
      viewDataTmp.orderChargeBackDataTmp.realPay = order.realPay;
      viewDataTmp.orderChargeBackDataTmp.chargeBackCost = order.chargeBackCost;
      viewDataTmp.chargeBackInfoTmp.refundableAmount = this.formatAmount(viewDataTmp.chargeBackInfoTmp.refundableAmount);
      viewDataTmp.orderChargeBackDataTmp.realPay = this.formatAmount(viewDataTmp.orderChargeBackDataTmp.realPay);
      viewDataTmp.orderChargeBackDataTmp.chargeBackCost = this.formatAmount(viewDataTmp.orderChargeBackDataTmp.chargeBackCost);

      this.buildChargebackTypeTmp(viewDataTmp);
    }

    callback(viewDataTmp);
  }

  private async getChargeBackItemMap(orderId: string) {
    let chargeBackItemMap = new ZmMap<ChargeBackItem>();

    let orderNotes: OrderNotes = await this.orderNotesMgr.getOrderNotes(orderId);
    let chargeBackRecordList: Array<ChargeBackRecord> = orderNotes.getChargeBackRecordMap().values();
    for (let item of chargeBackRecordList) {
      if (item.chargeBackItems) {
        for (let itemTmp of item.chargeBackItems) {
          chargeBackItemMap.put(itemTmp.itemId,itemTmp);
        }
      }
    }
    return chargeBackItemMap;
  }

  private buildChargebackTypeTmp(viewDataTmp: ChargebackInfoViewData) {
    //退款方式
    this.setType(viewDataTmp);
    //可退余额
    this.setBalance(viewDataTmp);
  }

  private setType(viewDataTmp: ChargebackInfoViewData) {
    let payTypeList = new Array<number>();
    viewDataTmp.payItems.forEach((item) => {
      payTypeList.push(item.payType);
    });
    if (AppUtils.arrayContains(payTypeList, "4") || AppUtils.arrayContains(payTypeList, 4)) {
      viewDataTmp.chargeBackTypeTmp.withMemCard = true;
    }
    if (AppUtils.arrayContains(payTypeList, "5") || AppUtils.arrayContains(payTypeList, 5)) {
      viewDataTmp.chargeBackTypeTmp.withArrerage = true;
    }
    if(AppUtils.arrayContains(payTypeList, "0") ||
      AppUtils.arrayContains(payTypeList, "1") ||
      AppUtils.arrayContains(payTypeList, "2") ||
      AppUtils.arrayContains(payTypeList, "3") ||
      AppUtils.arrayContains(payTypeList, 0) ||
      AppUtils.arrayContains(payTypeList, 1) ||
      AppUtils.arrayContains(payTypeList, 2) ||
      AppUtils.arrayContains(payTypeList, 3)) {
      viewDataTmp.chargeBackTypeTmp.otherWay = true;
    }
  }

  private setBalance(viewDataTmp: ChargebackInfoViewData) {
    //支付金额
    let memCardPayItem = new PayItem();
    let arreargePayItem = new PayItem();
    for (let payItemTmp of viewDataTmp.payItems) {
      if (parseInt(payItemTmp.payType.toString()) == PayTypeEnum.MEMBERSHIPCARD) {
        memCardPayItem = payItemTmp;
        break;
      }
    }
    for (let payItemTmp of viewDataTmp.payItems) {
      if (parseInt(payItemTmp.payType.toString()) == PayTypeEnum.ARREARAGE) {
        arreargePayItem = payItemTmp;
        break;
      }
    }
    //退款金额
    let memCardBackPayItem = new PayItem();
    let arreargeBackPayItem = new PayItem();
    if (viewDataTmp.chargeBackPayItemList) {
      for (let chargebackPayItemTmp of viewDataTmp.chargeBackPayItemList) {
        if (parseInt(chargebackPayItemTmp.payType.toString()) == PayTypeEnum.MEMBERSHIPCARD) {
          memCardBackPayItem = chargebackPayItemTmp;
          break;
        }
      }
      for (let chargebackPayItemTmp of viewDataTmp.chargeBackPayItemList) {
        if (parseInt(chargebackPayItemTmp.payType.toString()) == PayTypeEnum.ARREARAGE) {
          arreargeBackPayItem = chargebackPayItemTmp;
          break;
        }
      }
    }
    if(!AppUtils.isNullObj(memCardPayItem.cost) && !AppUtils.isNullObj(memCardBackPayItem.cost)) {
      viewDataTmp.chargeBackTypeTmp.memCardBalance = memCardPayItem.cost - memCardBackPayItem.cost;
    } else {
      viewDataTmp.chargeBackTypeTmp.memCardBalance = memCardPayItem.cost;
    }
    if (!AppUtils.isNullObj(arreargePayItem.cost) && !AppUtils.isNullObj(arreargeBackPayItem.cost)) {
      viewDataTmp.chargeBackTypeTmp.arrerageBalance = arreargePayItem.cost - arreargeBackPayItem.cost;
    } else {
      viewDataTmp.chargeBackTypeTmp.arrerageBalance = arreargePayItem.cost;
    }
  }

  //退款方式及金额
  private async buildChargeBackPayItemList(order: Order) {
    let chargeBackPayItemList: Array<PayItem> = new Array<PayItem>();
    let orderNotes: OrderNotes = await this.orderNotesMgr.getOrderNotes(order.id);
    let chargeBackRecordList: Array<ChargeBackRecord> = orderNotes.getChargeBackRecordMap().values();
    if (chargeBackRecordList) {
      for (let item of chargeBackRecordList) {
        if (item.payItems) {
          chargeBackPayItemList = chargeBackPayItemList.concat(item.payItems);
        }
      }
    }
    return this.sumRepeat(chargeBackPayItemList);
  }

  private sumRepeat(chargeBackPayItemList) {
    let map = new ZmMap<PayItem>();
    chargeBackPayItemList.forEach((item) => {
      let itemTmp = map.get(item.payType.toString());
      if (itemTmp != null) {
        itemTmp.cost = parseFloat(item.cost.toString()) + parseFloat(itemTmp.cost.toString());
      } else {
        map.put(item.payType.toString(), item);
      }
    });
    chargeBackPayItemList = map.values();
    return chargeBackPayItemList;
  }

  private async buildChargeBackItemList(order: Order, viewDataTmp: ChargebackInfoViewData) {
    let chargeBackItemDataList: Array<ChargeBackItemData> = new Array<ChargeBackItemData>();
    let buyItems = order.buyItems;
    let delimitCardItems = order.delimitCardItems;
    let donationItems = order.donationItems;

    await this.fromBuyItem(order,viewDataTmp, buyItems, chargeBackItemDataList);
    await this.fromDelimitCardItem(viewDataTmp, delimitCardItems, chargeBackItemDataList);
    await this.fromDonationItems(viewDataTmp, donationItems, chargeBackItemDataList);

    return chargeBackItemDataList;
  }

  private async fromBuyItem(order:Order,viewDataTmp: ChargebackInfoViewData, buyItems: Array <BuyItem>, chargeBackItemDataList: Array<ChargeBackItemData>) {
    if (buyItems) {
      for (let buyItem of buyItems) {
        let chargeBackItem = new ChargeBackItemData();
        chargeBackItem.itemId = buyItem.buyItemId;
        chargeBackItem.pgId = buyItem.pgId;
        chargeBackItem.type = buyItem.buyType;
        chargeBackItem.payType = PrdCardPayEnum.CashPay;
        chargeBackItem.sellPrice = buyItem.price;
        chargeBackItem.totalCount = buyItem.count;
        chargeBackItem.refundableCount = buyItem.count;
        chargeBackItem.refundCount = chargeBackItem.refundableCount;
        chargeBackItem.refundAmount = chargeBackItem.refundableCount * chargeBackItem.sellPrice;
        chargeBackItem.refundAmount = this.formatAmount(chargeBackItem.refundAmount);

        let buyType = new BuyType();
        buyType.type = buyItem.buyType;
        buyType.pgId = buyItem.pgId;
        let target:ProductTarget = this.getTargetWithBuyType(buyType,viewDataTmp);

        chargeBackItem.type = target.type;
        chargeBackItem.pgName = target.pgName;
        chargeBackItem.pgTypeName = target.pgTypeName;

        if (order.chargeBackCost > 0) {
            let chargeBackItemTmp = viewDataTmp.chargeBackItemMap.get(chargeBackItem.itemId);
            if(chargeBackItemTmp){
              chargeBackItem.refundedCount = chargeBackItemTmp.count;
              chargeBackItem.refundableCount = chargeBackItem.totalCount - chargeBackItem.refundedCount;
              chargeBackItem.refundCount = chargeBackItem.refundableCount;
            }
        }
        chargeBackItemDataList.push(chargeBackItem);
      }
    }
  }

  private async fromDelimitCardItem(viewDataTmp: ChargebackInfoViewData, delimitCardItems: Array < DelimitCardItem >, chargeBackItemDataList: Array <ChargeBackItemData>) {
    if (delimitCardItems) {
      for (let delimitCardItem of delimitCardItems) {
        let chargeBackItem = new ChargeBackItemData();
        chargeBackItem.itemId = delimitCardItem.delimitCardItemId;
        chargeBackItem.pgId = delimitCardItem.pgId;
        chargeBackItem.payType = PrdCardPayEnum.PrdCard;
        chargeBackItem.totalCount = delimitCardItem.count;
        chargeBackItem.refundableCount = delimitCardItem.count;
        chargeBackItem.refundCount = chargeBackItem.refundableCount;
        chargeBackItem.sellPrice = 0;
        chargeBackItem.refundAmount = chargeBackItem.refundableCount * chargeBackItem.sellPrice;
        chargeBackItem.refundAmount = this.formatAmount(chargeBackItem.refundAmount);

        let buyType = new BuyType();
        buyType.type = delimitCardItem.itemType;
        buyType.type = this.turnType(buyType.type);//ProductCardItemEnum ==>BuyTypeEnum
        buyType.pgId = delimitCardItem.pgId;
        let target:ProductTarget = this.getTargetWithBuyType(buyType,viewDataTmp);
        chargeBackItem.type = target.type;
        chargeBackItem.pgName = target.pgName;
        chargeBackItem.pgTypeName = target.pgTypeName;

        if(viewDataTmp.chargeBackItemMap){
          let chargeBackItemTmp = viewDataTmp.chargeBackItemMap.get(chargeBackItem.itemId);
          if(chargeBackItemTmp){
            chargeBackItem.refundedCount = chargeBackItemTmp.count;
            chargeBackItem.refundableCount = chargeBackItem.totalCount - chargeBackItem.refundedCount;
            chargeBackItem.refundCount = chargeBackItem.refundableCount;
          }
        }

        chargeBackItemDataList.push(chargeBackItem);
      }
    }
  }

  //次卡里面的项的枚举是ProductCardItemEnum
  //转成BuyTypeEnum去取对象
  private turnType(type:number){
    if(type == ProductCardItemEnum.PACKAGE){
      type = parseInt(type.toString())+2;
    }else{
      type = parseInt(type.toString())+1;
    }
    return type;
  }

  private async fromDonationItems(viewDataTmp: ChargebackInfoViewData, donationItems: Array < DonationItem >, chargeBackItemDataList: Array < ChargeBackItemData >) {
    if (donationItems) {
      for (let donationItem of donationItems) {
        let chargeBackItem = new ChargeBackItemData();
        chargeBackItem.itemId = donationItem.donationItemId;
        chargeBackItem.pgId = donationItem.pgId;
        chargeBackItem.payType = PrdCardPayEnum.Donation;
        chargeBackItem.sellPrice = 0;
        chargeBackItem.cost = donationItem.cost;
        chargeBackItem.totalCount = donationItem.count;
        chargeBackItem.refundableCount = donationItem.count;
        chargeBackItem.refundCount = chargeBackItem.refundableCount;
        chargeBackItem.refundAmount = chargeBackItem.refundableCount * chargeBackItem.sellPrice;
        chargeBackItem.refundAmount = this.formatAmount(chargeBackItem.refundAmount);

        let buyType = new BuyType();
        buyType.type = donationItem.buyType;
        buyType.pgId = donationItem.pgId;
        let target:ProductTarget = this.getTargetWithBuyType(buyType,viewDataTmp);
        chargeBackItem.type = target.type;
        chargeBackItem.pgName = target.pgName;
        chargeBackItem.pgTypeName = target.pgTypeName;

        if(viewDataTmp.chargeBackItemMap){
          let chargeBackItemTmp = viewDataTmp.chargeBackItemMap.get(chargeBackItem.itemId);
          if(chargeBackItemTmp){
            chargeBackItem.refundedCount = chargeBackItemTmp.count;
            chargeBackItem.refundableCount = chargeBackItem.totalCount - chargeBackItem.refundedCount;
            chargeBackItem.refundCount = chargeBackItem.refundableCount;
          }
        }

        chargeBackItemDataList.push(chargeBackItem);
      }
    }
  }

  private getTargetWithBuyType(buyType:BuyType,viewDataTmp:ChargebackInfoViewData){
    let productTarget = new ProductTarget();
    if (buyType.type == BuyTypeEnum.PRODUCT) {
      productTarget.type = BuyTypeEnum.PRODUCT;
      let target = viewDataTmp.productMap.get(buyType.pgId);
      if (target) {
        productTarget.pgName = target.name;
        let targetType = viewDataTmp.productTypeMap.get(target.typeId.toString());
        if (targetType) {
          productTarget.pgTypeName = targetType.name;
        }
      }
    } else if (buyType.type == BuyTypeEnum.GOODS) {
      productTarget.type = BuyTypeEnum.GOODS;
      let target = viewDataTmp.goodsMap.get(buyType.pgId);
      if (target) {
        productTarget.pgName = target.name;
        let targetType = viewDataTmp.goodsTypeMap.get(target.typeId.toString());
        if (targetType) {
          productTarget.pgTypeName = targetType.name;
        }
      }
    } else if (buyType.type == BuyTypeEnum.PRDCARD) {
      productTarget.type = BuyTypeEnum.PRDCARD;
      let target = viewDataTmp.productCardMap.get(buyType.pgId);
      if (target) {
        productTarget.pgName = target.name;
        let targetType = viewDataTmp.productCardTypeMap.get(target.typeId.toString());
        if (targetType) {
          productTarget.pgTypeName = targetType.name;
        }
      }
    } else if (buyType.type == BuyTypeEnum.PACKAGE) {
      productTarget.type = BuyTypeEnum.PACKAGE;
      let target = viewDataTmp.packageProjectMap.get(buyType.pgId);
      if (target) {
        productTarget.pgName = target.name;
        let targetType = viewDataTmp.packageProjectTypeMap.get(target.typeId.toString());
        if (targetType) {
          productTarget.pgTypeName = targetType.name;
        }
      }
    }
    return productTarget;
  }

  private formatAmount(amount: number) {
    amount = AppUtils.roundPoint(amount, 2);
    amount = AppUtils.appendZero(amount);
    return amount;
  }
}

class BuyType{
  type:number;
  pgId:string;
}
 class ProductTarget{
  pgName:string;
  pgTypeName:string;
  type:number;//BuyTypeEnum
}
