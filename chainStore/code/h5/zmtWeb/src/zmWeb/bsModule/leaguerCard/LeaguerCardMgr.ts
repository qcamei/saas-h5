import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppCfg} from "../../comModule/AppCfg";
import {PageResp} from "../../comModule/PageResp";
import {ReqMap} from "../../comModule/AppUtils";
import {LeaguerCard} from "./data/LeaguerCard";
import {LeaguerCardQueryForm} from "./apiData/LeaguerCardQueryForm";

@Injectable()
export class LeaguerCardMgr{

  private leaguerCardDao:LeaguerCardDao;

  constructor(private restProxy:AsyncRestProxy){
    this.leaguerCardDao = new LeaguerCardDao(restProxy);
  }

  /**
   * 获取列表
   * @param queryForm
   * @returns {Promise<PageResp>}
   */
  public getExpiredCardPageInfo(queryForm:LeaguerCardQueryForm):Promise<PageResp>{
    var reqMap =new ReqMap().add("storeId",queryForm.storeId)
      .add("leaguerNameOrPhone",queryForm.leaguerNameOrPhone)
      .add("loadType",queryForm.loadType.toString())
      .add("sort",queryForm.sort.toString())
      .add("cardTypeId",queryForm.cardTypeId)
      .add("pageItemCount",queryForm.pageItemCount.toString())
      .add("pageNo",queryForm.pageNo.toString());
    var findPath = "getExpiredCardPageInfo";
    return this.leaguerCardDao.getPageRespByType(findPath,reqMap,LeaguerCard);
  }

}

export class LeaguerCardDao extends AsyncRestDao<LeaguerCard>{
  constructor(restProxy:AsyncRestProxy){
    var table = "leaguerCard";
    super(LeaguerCard,restProxy,table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
