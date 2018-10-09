import {DelimitCardItem} from "../../../../bsModule/order/data/DelimitCardItem";
import {ProductCardItemEnum} from "../../../../bsModule/productCardDetail/data/ProductCardItemEnum";
import {BuyTypeEnum} from "../../../../bsModule/order/data/BuyTypeEnum";
import {PrdCardPayEnum} from "../../../../bsModule/workFlow/data/PrdCardPayEnum";
import {BuyItem} from "../../../../bsModule/order/data/BuyItem";
import {DonationItem} from "../../../../bsModule/order/data/DonationItem";

export class SimpleBuyItem{
  public pgId:string;
  public pgName:string;
  public buyType:number;
  public count:number;
  public payType:number;

  public static fromDelimitCarditem(item:DelimitCardItem):SimpleBuyItem{
    let simpleBuyItem = new SimpleBuyItem();
    simpleBuyItem.pgId = item.pgId;
    simpleBuyItem.count = item.count;
    if(item.itemType == ProductCardItemEnum.PRODUCT){
      simpleBuyItem.buyType = BuyTypeEnum.PRODUCT;
    }else if(item.itemType == ProductCardItemEnum.GOODS){
      simpleBuyItem.buyType = BuyTypeEnum.GOODS;
    }else if(item.itemType == ProductCardItemEnum.PACKAGE){
      simpleBuyItem.buyType = BuyTypeEnum.PACKAGE;
    }
    simpleBuyItem.payType = PrdCardPayEnum.PrdCard;
    return simpleBuyItem;
  }

  public static fromBuyItem(item:BuyItem):SimpleBuyItem{
    let simpleBuyItem = new SimpleBuyItem();
    simpleBuyItem.pgId = item.pgId;
    simpleBuyItem.count = item.count;
    simpleBuyItem.buyType = item.buyType;
    simpleBuyItem.payType = PrdCardPayEnum.CashPay;
    return simpleBuyItem;
  }

  public static fromDonationItem(item:DonationItem):SimpleBuyItem{
    let simpleBuyItem = new SimpleBuyItem();
    simpleBuyItem.pgId = item.pgId;
    simpleBuyItem.count = item.count;
    simpleBuyItem.buyType = item.buyType;
    simpleBuyItem.payType = PrdCardPayEnum.Donation;
    return simpleBuyItem;
  }
}
