import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {GoodsDetail} from "./data/GoodsDetail";
import {AppCfg} from "../../comModule/AppCfg";
import {GoodsDetailQueryForm} from "./apiData/GoodsDetailQueryForm";
import {PageResp} from "../../comModule/PageResp";
import {ReqMap} from "../../comModule/AppUtils";
import {IntfDetailMgr} from "../../comModule/dataDetail/IntfDetailMgr";


@Injectable()
export class GoodsDetailMgr implements IntfDetailMgr{

  private goodsDetailDao:GoodsDetailDao;

  constructor(private restProxy:AsyncRestProxy){
    this.goodsDetailDao = new GoodsDetailDao(restProxy);
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
      .add("typeId", queryForm.typeId.toString())
      .add("state", queryForm.state.toString())
      .add("pageItemCount", pageItemCount.toString())
      .add("pageNo", queryForm.pageNo.toString());
    return this.goodsDetailDao.getPageRespByType(findPath, reqMap,GoodsDetail);
  }

}

export class GoodsDetailDao extends AsyncRestDao<GoodsDetail>{
  constructor(restProxy:AsyncRestProxy){
    var table = "goodsDetail";
    super(GoodsDetail,restProxy,table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
