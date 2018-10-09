import {EntityStateEnum} from "../../../comModule/enum/EntityStateEnum";
import {ZmMap} from "../../../comModule/AppUtils";
import {Goods} from "./Goods";
import {GoodsType} from "./GoodsType";
import {GoodsStateEnum} from "./GoodsStateEnum";
export class ChainGoods {
    constructor(){}
    id:number;
    chainId:number;
    goodsIdIndex:number;
    goodsMap:any;
    goodsTypeIdIndex:number;
    goodsTypeMap:any;
    splitMark:number;
    createdTime:number;
    lastUpdateTime:number;
    ver:number;

  //所有的商品Map
  public getAllGoodsMap():ZmMap<Goods>{
    let targetMapTmp = this.goodsMap;
    let targetMap = new ZmMap<Goods>();
    for (let index in targetMapTmp) {
      let goods:Goods = targetMapTmp[index];
      targetMap.put(goods.id,goods);
    }
    return targetMap;
  }

  public getValidGoodsMap() {
    let targetMapTmp = this.goodsMap;
    let targetMap = new ZmMap<Goods>();
    for (let index in targetMapTmp) {
      let goods = targetMapTmp[index];
      if(goods.entityState == EntityStateEnum.Normal){
        targetMap.put(goods.id,goods);
      }
    }
    return targetMap;
  }

  public getAllGoodsTypeMap() {
    let targetMapTmp = this.goodsTypeMap;
    let targetMap = new ZmMap<GoodsType>();
    for (let index in targetMapTmp) {
      let goodsType = targetMapTmp[index];
      targetMap.put(goodsType.id,goodsType);
    }
    return targetMap;
  }

  public getValidGoodsTypeMap() {
    let targetMapTmp = this.goodsTypeMap;
    let targetMap = new ZmMap<GoodsType>();
    for (let index in targetMapTmp) {
      let goodsType = targetMapTmp[index];
      if(goodsType.entityState == EntityStateEnum.Normal){
        targetMap.put(goodsType.id,goodsType);

      }
    }
    return targetMap;
  }

  public getOpenGoodsMap():ZmMap<Goods> {
    let targetMapTmp = this.goodsMap;
    let targetMap = new ZmMap<Goods>();
    for (let index in targetMapTmp) {
      let goods:Goods = targetMapTmp[index];
      if(goods.entityState == EntityStateEnum.Normal && goods.state == GoodsStateEnum.Open){
        targetMap.put(goods.id.toString(),goods);
      }
    }
    return targetMap;
  }
}
