import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppCfg} from "../../comModule/AppCfg";
import {RestResp} from "../../comModule/RestResp";
import {ReqMap, AppUtils} from "../../comModule/AppUtils";
import {ChainGoods} from "./data/ChainGoods";
import {GoodsDetail} from "./data/GoodsDetail";


@Injectable()
export class ChainGoodsMgr {
  private chainProductDao: ChainGoodsDao;

  constructor(private restProxy: AsyncRestProxy) {
    this.chainProductDao = new ChainGoodsDao(restProxy);
  }

  /**
   * 查询总店项目
   * @param id
   * @returns {Promise<ChainGoods>}
   */
  public get(id:number):Promise<ChainGoods>{
    return this.chainProductDao.get(id);
  }

  /**
   * 获取总店商品详情
   * @param goodsId
   * @param chainId
   * @returns {Promise<GoodsDetail>}
   */
  public findDetail(goodsId:string,chainId:number):Promise<GoodsDetail>{
    let findPath = "findGoodsDetail";
    let reqMap = new ReqMap();
    reqMap.add("goodsId",goodsId)
      .add("chainId",chainId.toString());
    return new Promise<GoodsDetail>(resolve=>{
      this.chainProductDao.getWithReqParam(findPath,reqMap).then((restResp:RestResp)=>{
        let targetTmp:GoodsDetail = null;
        if(!AppUtils.isNullObj(restResp) && !AppUtils.isNullOrWhiteSpace(restResp.tJson)){
          targetTmp = new GoodsDetail();
          AppUtils.copyJson(targetTmp,restResp.tJson);
        }
        resolve(targetTmp);
      })
    })
  }


}

export class ChainGoodsDao extends AsyncRestDao<ChainGoods> {
  constructor(restProxy: AsyncRestProxy) {
    var table = "chainGoods";
    super(ChainGoods, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
