import {Injectable} from "@angular/core";
import {IntfDetailMgr} from "../../comModule/dataDetail/IntfDetailMgr";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {GoodsDetail} from "./data/GoodsDetail";
import {GoodsDetailQueryForm} from "./apiData/GoodsDetailQueryForm";
import {PageResp} from "../../comModule/PageResp";
import {ReqMap, AppUtils} from "../../comModule/AppUtils";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppCfg} from "../../comModule/AppCfg";

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
  public get(chainId:string,goodsId:number):Promise<GoodsDetail>{
    let uriPattern = "{0}/{1}";
    let id = AppUtils.format(uriPattern,chainId,goodsId);
    return this.goodsDetailDao.get(id);
  }

  public getGoodsDetailPageInfo(queryForm:GoodsDetailQueryForm):Promise<PageResp>{
    let findPath = "getGoodsDetailPageInfo";
    let pageItemCount = 10;
    let reqMap = new ReqMap();

    let state = "";
    if(queryForm.stateArray){
      state = queryForm.stateArray.join(",");
    }
    reqMap.add("chainId", queryForm.chainId)
      .add("numberOrName", queryForm.numberOrName)
      .add("typeId", queryForm.typeId)
      .add("stateArray", state)
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
