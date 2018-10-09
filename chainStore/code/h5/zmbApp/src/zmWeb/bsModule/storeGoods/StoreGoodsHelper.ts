import {AppUtils, ZmMap} from "../../comModule/AppUtils";
import {MgrPool} from "../../comModule/MgrPool";
import {StoreGoods} from "./data/StoreGoods";
import {Goods} from "./data/Goods";
import {GoodsType} from "./data/GoodsType";

export class StoreGoodsHelper {

  public static getInstance(): StoreGoodsHelper {
    return MgrPool.getInstance().get("StoreGoodsHelper", StoreGoodsHelper);
  }

  /**
   * 根据 goodsId 获取 Goods
   *
   * @param storeGoods
   * @param goodsId
   * @return
   */
  public getGoodsById(storeGoods: StoreGoods, goodsId: string): Goods {
    if (AppUtils.isNullObj(storeGoods)) return null;
    let goodsMap: ZmMap<Goods> = storeGoods.getAllGoodsMap();
    let goods: Goods = goodsMap.get(goodsId);
    return goods;
  }

  /**
   * 根据 id 获取 GoodsType
   * @param {StoreGoods} storeGoods
   * @param {string} goodsTypeId
   * @returns {GoodsType}
   */
  public getGoodsTypeById(storeGoods: StoreGoods, goodsTypeId: string): GoodsType{
    if (AppUtils.isNullObj(storeGoods)) return null;
    let goodsTypeMap: ZmMap<GoodsType> = storeGoods.getAllGoodsTypeMap();
    let goodsType: GoodsType = goodsTypeMap.get(goodsTypeId);
    return goodsType;
  }
}
