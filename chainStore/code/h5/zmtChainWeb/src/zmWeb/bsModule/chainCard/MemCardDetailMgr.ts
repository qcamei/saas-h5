import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppCfg} from "../../comModule/AppCfg";
import {PageResp} from "../../comModule/PageResp";
import {ReqMap, AppUtils} from "../../comModule/AppUtils";
import {MembershipCardDetail} from "./data/MembershipCardDetail";
import {MembershipCardDetailQueryForm} from "./apiData/MembershipCardDetailQueryForm";
import {IntfDetailMgr} from "../../comModule/dataDetail/IntfDetailMgr";


@Injectable()
export class MembershipCardDetailMgr implements IntfDetailMgr{

  private memCardDetailDao:MemCardDetailDao;

  constructor(private restProxy:AsyncRestProxy){
    this.memCardDetailDao = new MemCardDetailDao(restProxy);
  }

  /**
   * 通过商品id获取详情
   * @param GoodsId
   * @returns {Promise<MemCardDetail>}
   */
  public get(chainId:string,memCardId:string):Promise<MembershipCardDetail>{
    let uriPattern = "{0}/{1}";
    let id = AppUtils.format(uriPattern,chainId,memCardId);
    return this.memCardDetailDao.get(id);
  }

  public getMembershipCardDetailPageInfo(queryForm:MembershipCardDetailQueryForm):Promise<PageResp>{
    let findPath = "getMembershipCardDetailPageInfo";
    let pageItemCount = 10;
    let reqMap = new ReqMap();
    let status = "";
    if(queryForm.statusSet){
      status = queryForm.statusSet.join(",");
    }
    reqMap.add("chainId", queryForm.chainId)
      .add("cardNameOrNumber", queryForm.cardNameOrNumber)
      .add("statusSet", status)
      .add("pageItemCount", pageItemCount.toString())
      .add("pageNo", queryForm.pageNo.toString());
    return this.memCardDetailDao.getPageRespByType(findPath, reqMap,MembershipCardDetail);
  }

}

export class MemCardDetailDao extends AsyncRestDao<MembershipCardDetail>{
  constructor(restProxy:AsyncRestProxy){
    var table = "membershipCardDetail";
    super(MembershipCardDetail,restProxy,table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
