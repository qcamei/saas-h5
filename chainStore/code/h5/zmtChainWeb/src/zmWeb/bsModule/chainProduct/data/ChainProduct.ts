import {ZmMap, AppUtils} from "../../../comModule/AppUtils";
import {Product} from "./Product";
import {EntityStateEnum} from "../../../comModule/enum/EntityStateEnum";
import {ProductType} from "./ProductType";
import {ProductStateEnum} from "./ProductStateEnum";

export class ChainProduct {
    constructor(){}
    id:number;
    chainId:number;
    productIdIndex:number;
    productInfoMap:any;
    productTypeIdIndex:number;
    productTypeMap:any;
    splitMark:number;
    createdTime:number;
    lastUpdateTime:number;
    ver:number;

  public getAllProductMap() {
    let targetMapTmp = this.productInfoMap;
    let targetMap = new ZmMap<Product>();
    for (let index in targetMapTmp) {
      let targetTmp = targetMapTmp[index];
      let productInfo = new Product();
      AppUtils.copy(productInfo, targetTmp);
      targetMap.put(productInfo.id.toString(), productInfo);
    }
    return targetMap;
  }

  //有效的项目Map
  public getValidProductMap() {
    let targetMapTmp = this.productInfoMap;
    let targetMap = new ZmMap<Product>();
    for (let index in targetMapTmp) {
      let targetTmp = targetMapTmp[index];
      let productInfo = new Product();
      if (targetTmp.entityState == EntityStateEnum.Normal) {
        AppUtils.copy(productInfo, targetTmp);
        targetMap.put(productInfo.id.toString(), productInfo);
      }
    }
    return targetMap;
  }

  public getAllProductTypeMap() {
    let targetMapTmp = this.productTypeMap;
    let targetMap = new ZmMap<ProductType>();
    for (let index in targetMapTmp) {
      let productType = targetMapTmp[index];
      targetMap.put(productType.id, productType);
    }
    return targetMap;
  }

  //有效的项目分类Map
  public getValidProductTypeMap() {
    let targetMapTmp = this.productTypeMap;
    let targetMap = new ZmMap<ProductType>();
    for (let index in targetMapTmp) {
      let productType = targetMapTmp[index];
      if (productType.entityState == EntityStateEnum.Normal) {
        targetMap.put(productType.id, productType);
      }

    }
    return targetMap;
  }

  //上架的项目Map
  public getOpenProductInfoMap() {
    let targetMapTmp = this.productInfoMap;
    let targetMap = new ZmMap<Product>();
    for (let index in targetMapTmp) {
      let targetTmp = targetMapTmp[index];
      if (targetTmp.entityState == EntityStateEnum.Normal && targetTmp.state == ProductStateEnum.Open) {
        targetMap.put(targetTmp.id.toString(), targetTmp);
      }
    }
    return targetMap;
  }
}
