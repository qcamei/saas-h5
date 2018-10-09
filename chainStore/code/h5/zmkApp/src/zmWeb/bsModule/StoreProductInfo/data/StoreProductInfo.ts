import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {ProductInfo} from "./ProductInfo";
import {ProductType} from "./ProductType";
import {ProductInfoState} from "./ProductInfoState";
import {EntityState} from "../../../comModule/enum/EntityState";
export class StoreProductInfo {

  id: string;

  storeId: number;

  productIdIndex: number;

  productTypeIdIndex: number;

  packedProductIdIndex: number;

  productInfoMap: any;

  productTypeMap: any;

  createdTime: string;

  lastUpdateTime: string;

  ver: number;

  //遗留字段
  packedProductInfoMap: any;

  topProductIdList: Array<number>;


  constructor() {
  }

  //所有项目列表
  public getAllProductInfoList(): Array<ProductInfo> {
    let prdInfoMap = this.productInfoMap;
    let prdInfoArray = new Array<ProductInfo>();

    for (var key in prdInfoMap) {
      let prdInfoTmp: ProductInfo = new ProductInfo();
      AppUtils.copy(prdInfoTmp, prdInfoMap[key]);
      prdInfoArray.push(prdInfoTmp);
    }
    return prdInfoArray;
  }

  //有效的项目列表
  public getValidProductInfoList(): Array<ProductInfo> {
    let prdInfoMap = this.productInfoMap;
    let prdInfoArray = new Array<ProductInfo>();

    for (var key in prdInfoMap) {
      let prdInfoTmp: ProductInfo = new ProductInfo();
      if (prdInfoMap[key].entityState == EntityState.Normal) {
        AppUtils.copy(prdInfoTmp, prdInfoMap[key]);
        prdInfoArray.push(prdInfoTmp);
      }
    }
    return prdInfoArray;
  }

  //上架的项目列表
  public getOpenProductInfoList(): Array<ProductInfo> {
    let prdInfoMap = this.productInfoMap;
    let prdInfoArray = new Array<ProductInfo>();
    for (var key in prdInfoMap) {
      let prdInfoTmp: ProductInfo = new ProductInfo();
      if (prdInfoMap[key].entityState == EntityState.Normal && prdInfoMap[key].state == ProductInfoState.OPEN) {
        AppUtils.copy(prdInfoTmp, prdInfoMap[key]);
        prdInfoArray.push(prdInfoTmp);
      }
    }
    return prdInfoArray;
  }

  //项目详情
  public getProductInfoDetail(prdId: string): ProductInfo {
    let proInfoList: Array<ProductInfo> = this.getValidProductInfoList();
    let prdInfoTmp: ProductInfo = new ProductInfo();
    for (let prdInfo of proInfoList) {
      if (prdId == prdInfo.id) {
        AppUtils.copy(prdInfoTmp, prdInfo);
        break;
      }
    }
    return prdInfoTmp;
  }


  //有效的项目分类
  public getValidProductTypeList(): Array<ProductType> {
    let prdTypeMap = this.productTypeMap;
    let prdTypeArray = new Array<ProductType>();

    for (var key in prdTypeMap) {
      let prdTypeTmp: ProductType = new ProductType();
      if (prdTypeMap[key].entityState == EntityState.Normal) {
        AppUtils.copy(prdTypeTmp, prdTypeMap[key]);
        prdTypeArray.push(prdTypeTmp);
      }

    }
    return prdTypeArray;
  }

  //所有的项目分类
  public getAllProductTypeList(): Array<ProductType> {
    let proTypeMap = this.productTypeMap;
    let prdTypeArray = new Array<ProductType>();

    for (var key in proTypeMap) {
      let prdTypeTmp: ProductType = new ProductType();
      AppUtils.copy(prdTypeTmp, proTypeMap[key]);
      prdTypeArray.push(prdTypeTmp);
    }
    return prdTypeArray;
  }

  //项目分类详情
  public getPrdTypeDetail(prdTypeId: string): ProductType {
    let proTypeList: Array<ProductType> = this.getValidProductTypeList();
    let prdTypeTmp: ProductType = new ProductType();
    for (let prdType of proTypeList) {
      if (prdTypeId == prdType.id) {
        prdTypeTmp = prdType;
        break;
      }
    }
    return prdTypeTmp;
  }

  //所有的项目Map
  public getAllProductInfoMap() {
    let targetMapTmp = this.productInfoMap;
    let targetMap = new ZmMap<ProductInfo>();
    for (let index in targetMapTmp) {
      let targetTmp = targetMapTmp[index];
      let productInfo = new ProductInfo();
      AppUtils.copy(productInfo, targetTmp);
      targetMap.put(productInfo.id.toString(), productInfo);
    }
    return targetMap;
  }

  //有效的项目Map
  public getProductInfoMap() {
    let targetMapTmp = this.productInfoMap;
    let targetMap = new ZmMap<ProductInfo>();
    for (let index in targetMapTmp) {
      let targetTmp = targetMapTmp[index];
      let productInfo = new ProductInfo();
      if (targetTmp.entityState == EntityState.Normal) {
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
  public getProductTypeMap() {
    let targetMapTmp = this.productTypeMap;
    let targetMap = new ZmMap<ProductType>();
    for (let index in targetMapTmp) {
      let productType = targetMapTmp[index];
      if (productType.entityState == EntityState.Normal) {
        targetMap.put(productType.id, productType);
      }

    }
    return targetMap;
  }

  //Map<id,name>
  public getTypeMap() {
    let targetMapTmp = this.productTypeMap;
    let targetMap = new ZmMap<string>();
    for (let index in targetMapTmp) {
      let productType = targetMapTmp[index];
      targetMap.put(productType.id, productType.name);
    }
    return targetMap;
  }

  //上架的项目Map
  public getOpenProductInfoMap() {
    let targetMapTmp = this.productInfoMap;
    let targetMap = new ZmMap<ProductInfo>();
    for (let index in targetMapTmp) {
      let targetTmp = targetMapTmp[index];
      if (targetTmp.entityState == EntityState.Normal && targetTmp.state == ProductInfoState.OPEN) {
        targetMap.put(targetTmp.id.toString(), targetTmp);
      }
    }
    return targetMap;
  }


}

