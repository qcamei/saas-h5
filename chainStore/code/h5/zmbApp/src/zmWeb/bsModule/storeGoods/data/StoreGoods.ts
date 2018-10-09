import {Goods} from './Goods';
import {AppUtils, ZmMap} from '../../../comModule/AppUtils';
import {GoodsType} from './GoodsType';
import {GoodsStateEnum} from "./GoodsStateEnum";
import {EntityState} from "../../../comModule/enum/EntityState";

export class StoreGoods {
  id:number;
  storeId:number;
  goodsIdIndex:number;
  goodsTypeIdIndex:number;
  goodsMap:any;
  goodsTypeMap:any;
  topGoodsIdList:Array<string>;
  createdTime:number;
  lastUpdateTime:number;
  ver:number;

  constructor(){}

  public getAllGoodsList(): Array<Goods> {
    let goodsMap = this.goodsMap;
    let goodsArray = new Array<Goods>();

    for (var key in goodsMap) {
      let goodsTmp: Goods = new Goods();
      AppUtils.copy(goodsTmp, goodsMap[key]);
      goodsArray.push(goodsTmp);
    }
    return goodsArray;
  }


  public getValidGoodsList(): Array<Goods> {
    let goodsMap = this.goodsMap;
    let goodsArray = new Array<Goods>();

    for (var key in goodsMap) {
      let goodsTmp: Goods = new Goods();
      if(goodsMap[key].entityState == EntityState.Normal){
        AppUtils.copy(goodsTmp, goodsMap[key]);
        goodsArray.push(goodsTmp);
      }
    }
    return goodsArray;
  }

  public getAllGoodsTypeList():Array<GoodsType>{
    let goodsTypeMap = this.goodsTypeMap;
    let goodsTypeArray = new Array<GoodsType>();

    for (var key in goodsTypeMap) {
      let goodsTypeTmp:GoodsType = new GoodsType();
      AppUtils.copy(goodsTypeTmp, goodsTypeMap[key]);
      goodsTypeArray.push(goodsTypeTmp);
    }
    return goodsTypeArray;
  }

  public getValidGoodsTypeList():Array<GoodsType>{
    let goodsTypeMap = this.goodsTypeMap;
    let goodsTypeArray = new Array<GoodsType>();

    for (var key in goodsTypeMap) {
      let goodsTypeTmp:GoodsType = new GoodsType();
      if(goodsTypeMap[key].entityState == EntityState.Normal){
        AppUtils.copy(goodsTypeTmp, goodsTypeMap[key]);
        goodsTypeArray.push(goodsTypeTmp);
      }
    }
    return goodsTypeArray;
  }



  public getGoodsTypeDetail(goodsTypeId:string):GoodsType{
    let goodsTypeList:Array<GoodsType> = this.getValidGoodsTypeList();
    let goodsTypeTmp:GoodsType = new GoodsType();
    for (let goodsType of goodsTypeList) {
      if(goodsTypeId == goodsType.id) {
        goodsTypeTmp = goodsType;
        break;
      }
    }
    return goodsTypeTmp;
  }

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
      if(goods.entityState == EntityState.Normal){
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
      if(goodsType.entityState == EntityState.Normal){
        targetMap.put(goodsType.id,goodsType);

      }
    }
    return targetMap;
  }

  //Map<id,name>
  public getTypeMap() {
    let targetMapTmp = this.goodsTypeMap;
    let targetMap = new ZmMap<string>();
    for (let index in targetMapTmp) {
      let productType = targetMapTmp[index];
      targetMap.put(productType.id,productType.name);
    }
    return targetMap;
  }

  //上架的商品Map
  public getOpenGoodsMap():ZmMap<Goods> {
    let targetMapTmp = this.goodsMap;
    let targetMap = new ZmMap<Goods>();
    for (let index in targetMapTmp) {
      let goods:Goods = targetMapTmp[index];
      if(goods.entityState == EntityState.Normal && goods.state == GoodsStateEnum.Open){
        targetMap.put(goods.id.toString(),goods);
      }
    }
    return targetMap;
  }

}
