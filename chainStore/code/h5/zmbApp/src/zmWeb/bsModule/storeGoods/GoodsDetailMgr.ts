import {Injectable} from "@angular/core";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {GoodsDetail} from "./data/GoodsDetail";
import {AppCfg} from "../../comModule/AppCfg";
import {GoodsDetailQueryForm} from "./apiData/GoodsDetailQueryForm";
import {ReqMap} from "../../comModule/AppUtils";
import {MgrPool} from "../../comModule/MgrPool";
import {PageResp} from "../../comModule/asynDao/apiData/PageResp";
import {IntfDetailMgr} from "../../comModule/dataDetail/IntfDetailMgr";


@Injectable()
export class GoodsDetailMgr implements IntfDetailMgr{

  public static getInstance():GoodsDetailMgr{
    return MgrPool.getInstance().get("GoodsDetailMgr",GoodsDetailMgr);
  }

  private goodsDetailDao:GoodsDetailDao;

  constructor(){
    this.goodsDetailDao = new GoodsDetailDao();
  }

  /**
   * 通过商品id获取详情
   * @param GoodsId
   * @returns {Promise<GoodsDetail>}
   */
  public get(goodsId:number):Promise<GoodsDetail>{
    return this.goodsDetailDao.get(goodsId);
  }

  public getGoodsDetailPageInfo(queryForm:GoodsDetailQueryForm):Promise<PageResp>{
    let findPath = "getGoodsDetailPageInfo";
    let pageItemCount = 10;
    let reqMap = new ReqMap();
    reqMap.add("storeId", queryForm.storeId)
      .add("numberOrName", queryForm.numberOrName)
      .add("typeId", queryForm.typeId)
      .add("state", queryForm.state.toString())
      .add("pageItemCount", pageItemCount.toString());
    return this.goodsDetailDao.getPageRespByType(findPath, reqMap,GoodsDetail);
  }

}

export class GoodsDetailDao extends AsyncRestDao<GoodsDetail>{
  constructor(){
    var table = "goodsDetail";
    super(GoodsDetail,table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
