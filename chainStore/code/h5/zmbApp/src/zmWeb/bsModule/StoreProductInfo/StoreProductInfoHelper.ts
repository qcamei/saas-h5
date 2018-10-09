import {AppUtils, ZmMap} from "../../comModule/AppUtils";
import {MgrPool} from "../../comModule/MgrPool";
import {StoreProductInfo} from "./data/StoreProductInfo";
import {ProductInfo} from "./data/ProductInfo";
import {ProductType} from "./data/ProductType";

export class StoreProductInfoHelper {

  public static getInstance(): StoreProductInfoHelper {
    return MgrPool.getInstance().get("StoreProductInfoHelper", StoreProductInfoHelper);
  }

  /**
   * 根据 productInfoId 获取 ProductInfo
   *
   * @param storeProductInfo
   * @param productInfoId
   * @return
   */
  public getProductInfoById(storeProductInfo: StoreProductInfo, productInfoId: string): ProductInfo {
    if (AppUtils.isNullObj(storeProductInfo)) return null;

    let productInfoMap: ZmMap<ProductInfo> = storeProductInfo.getAllProductInfoMap();
    let productInfo: ProductInfo = productInfoMap.get(productInfoId);
    return productInfo;
  }

  /**
   * 根据 id 获取 ProductType
   * @param {StoreProductInfo} storeProductInfo
   * @param {string} productTypeId
   * @returns {ProductType}
   */
  public getProductTypeById(storeProductInfo: StoreProductInfo, productTypeId: string): ProductType{
    if (AppUtils.isNullObj(storeProductInfo)) return null;
    let productTypeMap: ZmMap<ProductType> = storeProductInfo.getAllProductTypeMap();
    let productType: ProductType = productTypeMap.get(productTypeId);
    return productType;
  }
}
