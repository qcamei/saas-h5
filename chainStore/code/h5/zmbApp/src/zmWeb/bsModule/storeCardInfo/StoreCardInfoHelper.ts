import {AppUtils, ZmMap} from "../../comModule/AppUtils";
import {MgrPool} from "../../comModule/MgrPool";
import {ProductCard} from "./data/ProductCard";
import {StoreCardInfo} from "./data/StoreCardInfo";
import {PrdCardType} from "./data/PrdCardType";

export class StoreCardInfoHelper {

  public static getInstance(): StoreCardInfoHelper {
    return MgrPool.getInstance().get("StoreCardInfoHelper", StoreCardInfoHelper);
  }

  /**
   * 根据 productCardId 获取 ProductCard
   *
   * @param storeCardInfo
   * @param productCardId
   * @return
   */
  public getProductCardById(storeCardInfo: StoreCardInfo, productCardId: string): ProductCard {
    if (AppUtils.isNullObj(storeCardInfo)) return null;
    let productCardMap: ZmMap<ProductCard> = storeCardInfo.getAllProductCardMap();
    let productCard: ProductCard = productCardMap.get(productCardId);
    return productCard;
  }

  /**
   * 根据 id 获取 PrdCardType
   * @param {StoreCardInfo} storeCardInfo
   * @param {string} prdCardTypeId
   * @returns {PrdCardType}
   */
  public getPrdCardTypeById(storeCardInfo: StoreCardInfo, prdCardTypeId: string): PrdCardType{
    if (AppUtils.isNullObj(storeCardInfo)) return null;
    let prdCardTypeMap: ZmMap<PrdCardType> = storeCardInfo.getAllProductCardTypeMap();
    let prdCardType: PrdCardType = prdCardTypeMap.get(prdCardTypeId);
    return prdCardType;
  }
}
