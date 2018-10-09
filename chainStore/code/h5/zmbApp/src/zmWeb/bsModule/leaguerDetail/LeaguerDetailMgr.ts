import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {LeaguerDetail} from "./data/LeaguerDetail";
import {AppCfg} from "../../comModule/AppCfg";
import {ReqMap} from "../../comModule/AppUtils";
import {LeaguerDetailQueryForm} from "./apiData/LeaguerDetailQueryForm";
import {IntfDetailMgr} from "../../comModule/dataDetail/IntfDetailMgr";
import {PageResp} from "../../comModule/asynDao/apiData/PageResp";
import {MgrPool} from "../../comModule/MgrPool";

// @Injectable()
export class LeaguerDetailMgr implements IntfDetailMgr{

  public static getInstance():LeaguerDetailMgr{
    return MgrPool.getInstance().get("LeaguerDetailMgr",LeaguerDetailMgr);
  }

  private leaguerDetailDao:LeaguerDetailDao;

  constructor() {
    this.leaguerDetailDao = new LeaguerDetailDao();
  }

  /**
   * 通过会员id获取详情
   * @param leaguerId
   * @returns {Promise<LeaguerDetail>}
   */
  public get(leaguerId:string):Promise<LeaguerDetail>{
    return this.leaguerDetailDao.get(leaguerId);
  }

  /**
   * 获取会员列表
   * @param queryForm
   * @returns {Promise<PageResp>}
   */
  public getLeaguerDetailPageInfo(queryForm:LeaguerDetailQueryForm):Promise<PageResp>{
    var reqMap =new ReqMap().add("storeId",queryForm.storeId)
      .add("maxTime",queryForm.maxTime)
      .add("minTime",queryForm.minTime)
      .add("leaguerNameOrPhone",queryForm.leaguerNameOrPhone)
      .add("leaguerType",queryForm.leaguerType.toString())
      .add("sortType",queryForm.sortType.toString())
      .add("sort",queryForm.sort.toString())
      .add("memberCardExpiredState",queryForm.memberCardExpiredState.toString())
      .add("pageItemCount",queryForm.pageItemCount.toString())
      .add("pageNo",queryForm.pageNo.toString());
    var findPath = "getLeaguerDetailPageInfo";
    return this.leaguerDetailDao.getPageRespByType(findPath,reqMap,LeaguerDetail);
  }
  //
  // public checkMemberCardExist(storeId:string,memberCardNumber:string):Promise<MemberCardExist>{
  //   let uriPattern = "{0}/{1}/{2}";
  //   let findPath = "checkMemberCardExist";
  //   let suffix = AppUtils.format(uriPattern, findPath, storeId, memberCardNumber);
  //   return new Promise<MemberCardExist>(resolve =>{
  //     this.leaguerDetailDao.getByUri(suffix).then((restResp:RestResp)=>{
  //       let targetTmp: MemberCardExist = null;
  //       if (restResp != null && !AppUtils.isNullOrWhiteSpace(restResp.tJson)) {
  //         targetTmp = new MemberCardExist();
  //         AppUtils.copyJson(targetTmp, restResp.tJson);
  //       }
  //       resolve(targetTmp);
  //     })
  //   })
  // }

}

export class LeaguerDetailDao extends AsyncRestDao<LeaguerDetail>{
  constructor(){
    var table = "leaguerDetail";
    super(LeaguerDetail,table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
