import {Subject, BehaviorSubject} from "rxjs";
import {Injectable} from "@angular/core";
import {
  WFDataWraper, BonusItemData, BillItemData, OrderWFCompData, BonusWFCompData,
  BuserWFCompData, ProdRecordsWFCompData, AttachProdsWFCompData, ProductCardWFCompData, FollowClerk, ProductItemData,
  GoodsItemData, CardItemData, RechargeOrderItemData, SuperItemData, ReduceItemData, PackageItemData
} from "./WFDataWraper";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {MembershipCard} from "../../../bsModule/storeCardInfo/data/MembershipCard";
import {BuyTypeEnum} from "../../../bsModule/workFlow/data/BuyTypeEnum";

@Injectable()
export class WFDataWraperMgr{

  private wfDataWraper:WFDataWraper;
  private _WFDataWraper: Subject<WFDataWraper> = new BehaviorSubject<WFDataWraper>(null);

  public init(typeNameP:string):WFDataWraper{
    this.wfDataWraper = new WFDataWraper(typeNameP);
    this._WFDataWraper.next(this.wfDataWraper);
    return this.wfDataWraper;
  }

  public setWFDataWraper(wfDataWraper:WFDataWraper){
    this._WFDataWraper.next(wfDataWraper);
    //刷新服务人员提成组件数据
    this.refreshBonusData();
    // //刷新结算单组件数据
    this.refreshOrderData();
  }

  public subscribeWFDataWraper(func:(wfDataWraper:WFDataWraper)=>void){
    this._WFDataWraper.subscribe(func);
  }

  /**切换会员,清除已选数据*/
  public changeLeaguer(wFDataWraper:WFDataWraper){
    wFDataWraper.getBuserWFCompData().selectFollowClerk = new FollowClerk();
    wFDataWraper.getDelimitCardRecordsWFCompData().reduceList = new Array<ReduceItemData>();
    wFDataWraper.getProdRecordsWFCompData().productList = new Array<ProductItemData>();
    wFDataWraper.getAttachProdsWFCompData().goodsList = new Array<GoodsItemData>();
    wFDataWraper.getPackageWFCompData().packageList = new Array<PackageItemData>();
    wFDataWraper.getProductCardWFCompData().cardList =  new Array<CardItemData>();
    wFDataWraper.getGiftWFCompData().productList = new Array<ProductItemData>();
    wFDataWraper.getGiftWFCompData().goodsList = new Array<GoodsItemData>();
    wFDataWraper.getGiftWFCompData().packageList =  new Array<PackageItemData>();
    wFDataWraper.getGiftWFCompData().cardList =  new Array<CardItemData>();
    wFDataWraper.getBonusWFCompData().bonusList = new Array<BonusItemData>();
    wFDataWraper.getBonusWFCompData().bonusMap = new ZmMap<BonusItemData>();
    wFDataWraper.getOrderWFCompData().billList = new Array<BillItemData>();
    wFDataWraper.getOrderWFCompData().reduceList = new Array<BillItemData>();
    wFDataWraper.getOrderWFCompData().giftList = new Array<BillItemData>();

    wFDataWraper.getRechargeSettingWFCompData().rechargeOrderItemData = new RechargeOrderItemData();
    wFDataWraper.getRechargeSettingWFCompData().memberCard = new MembershipCard();
    wFDataWraper.getRechargeSettingWFCompData().cash = null;
    wFDataWraper.getRechargeSettingWFCompData().alipay = null;
    wFDataWraper.getRechargeSettingWFCompData().wechat = null;
    wFDataWraper.getRechargeSettingWFCompData().slotCard = null;
  }

  /**
   * 修改提成购买项价格
   * @param bonusItemP
   */
  public changeBonusItemPrice(itemP){
    let bonusItemDataTmp:BonusItemData = null;
    switch (itemP.type){
      case BuyTypeEnum.PRODUCT:
        bonusItemDataTmp = BonusItemData.fromProductItem(itemP);
        break;
      case BuyTypeEnum.GOODS:
        bonusItemDataTmp = BonusItemData.fromGoodsItem(itemP);
        break;
      case BuyTypeEnum.PRDCARD:
        bonusItemDataTmp = BonusItemData.fromCardItem(itemP);
        break;
      case BuyTypeEnum.PACKAGE:
        bonusItemDataTmp = BonusItemData.fromPackageItem(itemP);
        break;
    }
    if(!AppUtils.isNullObj(bonusItemDataTmp)){
      let bonusWFCompData:BonusWFCompData = this.wfDataWraper.getBonusWFCompData();
      let bonusKey = this.getBonusKey(bonusItemDataTmp);
      if(bonusWFCompData.bonusMap.contains(bonusKey)){
        let bonusItemData = bonusWFCompData.bonusMap.get(bonusKey);
        bonusItemData.price = bonusItemDataTmp.price;
      }
    }
  }

  /**
   * 刷新服务人员列表
   * @param wfDataWraper
   */
  private refreshBonusData(){
    let bonusWFCompData:BonusWFCompData = this.wfDataWraper.getBonusWFCompData();
    bonusWFCompData.bonusMap.clear();
    bonusWFCompData.bonusList.forEach((item)=>{
      let bonusKey = this.getBonusKey(item);
      bonusWFCompData.bonusMap.put(bonusKey,item);
    })
    let bonusMapOld = bonusWFCompData.bonusMap;
    let bonusMapNew = new ZmMap<BonusItemData>();

    let prodRecordsWFCompData = this.wfDataWraper.getProdRecordsWFCompData();
    let attachProdsWFCompData = this.wfDataWraper.getAttachProdsWFCompData();
    let productCardWFCompData = this.wfDataWraper.getProductCardWFCompData();
    let packageWFCompData = this.wfDataWraper.getPackageWFCompData();
    let delimitCardRecordsWFCompData = this.wfDataWraper.getDelimitCardRecordsWFCompData();

    prodRecordsWFCompData.productList.forEach((item) =>{
      let bonusItemData = BonusItemData.fromProductItem(item);
      let key = this.getBonusKey(bonusItemData);
      if(bonusMapOld.contains(key)){
        bonusMapNew.put(key,bonusMapOld.get(key));
      }else{
        bonusMapNew.put(key,bonusItemData);
      }
    })
    attachProdsWFCompData.goodsList.forEach((item) =>{
      let bonusItemData = BonusItemData.fromGoodsItem(item);
      let key = this.getBonusKey(bonusItemData);
      if(bonusMapOld.contains(key)){
        bonusMapNew.put(key,bonusMapOld.get(key));
      }else{
        bonusMapNew.put(key,bonusItemData);
      }
    })
    productCardWFCompData.cardList.forEach((item) =>{
      let bonusItemData = BonusItemData.fromCardItem(item);
      let key = this.getBonusKey(bonusItemData);
      if(bonusMapOld.contains(key)){
        bonusMapNew.put(key,bonusMapOld.get(key));
      }else{
        bonusMapNew.put(key,bonusItemData);
      }
    })
    packageWFCompData.packageList.forEach((item) =>{
      let bonusItemData = BonusItemData.fromPackageItem(item);
      let key = this.getBonusKey(bonusItemData);
      if(bonusMapOld.contains(key)){
        bonusMapNew.put(key,bonusMapOld.get(key));
      }else{
        bonusMapNew.put(key,bonusItemData);
      }
    })
    delimitCardRecordsWFCompData.reduceList.forEach((item) =>{
      let bonusItemData = BonusItemData.fromReduceItem(item);
      let key = this.getBonusKey(bonusItemData);
      if(bonusMapOld.contains(key)){
        bonusMapNew.put(key,bonusMapOld.get(key));
      }else{
        bonusMapNew.put(key,bonusItemData);
      }
    })
    //赠送
    let giftWFCompData = this.wfDataWraper.getGiftWFCompData();
    let giftListTmp = new Array<SuperItemData>();
    giftListTmp = AppUtils.addAll(giftListTmp,giftWFCompData.productList);
    giftListTmp = AppUtils.addAll(giftListTmp,giftWFCompData.goodsList);
    giftListTmp = AppUtils.addAll(giftListTmp,giftWFCompData.packageList);
    giftListTmp = AppUtils.addAll(giftListTmp,giftWFCompData.cardList);
    giftListTmp.forEach((item) =>{
      let bonusItemData = BonusItemData.fromGiftItem(item);
      let key = this.getBonusKey(bonusItemData);
      if(bonusMapOld.contains(key)){
        bonusMapNew.put(key,bonusMapOld.get(key));
      }else{
        bonusMapNew.put(key,bonusItemData);
      }
    })

    bonusWFCompData.bonusMap = bonusMapNew;
    bonusWFCompData.bonusList = bonusWFCompData.bonusMap.values();
  }

  private getBonusKey(item:BonusItemData) {
    return item.type + item.id + item.payType;
  }

  /**
   * 刷新结算单列表
   */
  private refreshOrderData(){
    let orderWFCompData:OrderWFCompData = this.wfDataWraper.getOrderWFCompData();
    orderWFCompData.orderAmount = 0;
    orderWFCompData.orderCost = 0;
    orderWFCompData.disAmount = 0;
    //购买
    let billList = new Array<BillItemData>();
    let prodRecordsWFCompData = this.wfDataWraper.getProdRecordsWFCompData();
    let attachProdsWFCompData = this.wfDataWraper.getAttachProdsWFCompData();
    let productCardWFCompData = this.wfDataWraper.getProductCardWFCompData();
    let packageWFCompData = this.wfDataWraper.getPackageWFCompData();
    prodRecordsWFCompData.productList.forEach((item) =>{
      billList.push(BillItemData.fromProductItem(item));
    })
    attachProdsWFCompData.goodsList.forEach((item) =>{
      billList.push(BillItemData.fromGoodsItem(item));
    })
    productCardWFCompData.cardList.forEach((item) =>{
      billList.push(BillItemData.fromCardItem(item));
    })
    packageWFCompData.packageList.forEach((item) =>{
      billList.push(BillItemData.fromPackageItem(item));
    })
    orderWFCompData.billList = billList;
    //划卡
    let reduceList = new Array<BillItemData>();
    let delimitCardRecordsWFCompData = this.wfDataWraper.getDelimitCardRecordsWFCompData();
    delimitCardRecordsWFCompData.reduceList.forEach((item) =>{
      reduceList.push(BillItemData.fromReduceItem(item));
    })
    orderWFCompData.reduceList = reduceList;
    //赠送
    let giftList = new Array<BillItemData>();
    let giftWFCompData = this.wfDataWraper.getGiftWFCompData();
    giftWFCompData.productList.forEach((item) =>{
      giftList.push(BillItemData.fromProductItem(item));
    })
    giftWFCompData.goodsList.forEach((item) =>{
      giftList.push(BillItemData.fromGoodsItem(item));
    })
    giftWFCompData.cardList.forEach((item) =>{
      giftList.push(BillItemData.fromCardItem(item));
    })
    giftWFCompData.packageList.forEach((item) =>{
      giftList.push(BillItemData.fromPackageItem(item));
    })
    orderWFCompData.giftList = giftList;

    //刷新订单金额
    billList.forEach((item) =>{
      orderWFCompData.orderAmount = orderWFCompData.orderAmount + AppUtils.roundPoint(item.totalPrice,2);
      orderWFCompData.orderCost = orderWFCompData.orderCost + AppUtils.roundPoint(item.cost,2);
    })
    orderWFCompData.disAmount = orderWFCompData.orderAmount - orderWFCompData.orderCost;
    //刷新会员余额
    let cuserWFCompData = this.wfDataWraper.getCuserWFCompData();
    if(cuserWFCompData && cuserWFCompData.selectLeaguer && cuserWFCompData.selectLeaguer.leaguerMemberCard && cuserWFCompData.selectLeaguer.leaguerMemberCard.balance){
      orderWFCompData.balance = AppUtils.roundPoint(cuserWFCompData.selectLeaguer.leaguerMemberCard.balance,2);
    }
  }

}
