import {Injectable} from "@angular/core";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {LeaguerDetail} from "./data/LeaguerDetail";
import {AppCfg} from "../../comModule/AppCfg";
import {MgrPool} from "../../comModule/MgrPool";
import {AppUtils} from "../../comModule/AppUtils";

@Injectable()
export class LeaguerDetailMgr{

  public static getInstance():LeaguerDetailMgr{
    return MgrPool.getInstance().get("LeaguerDetailMgr",LeaguerDetailMgr);
  }

  private leaguerDetailDao:LeaguerDetailDao;

  constructor(){
    this.leaguerDetailDao = new LeaguerDetailDao();
  }

  /**
   * 通过会员id获取详情
   * @param leaguerId
   * @returns {Promise<LeaguerDetail>}
   */
  public get(storeId:string,leaguerId:string):Promise<LeaguerDetail>{
    let uriPattern = "{0}/{1}";
    let uri = AppUtils.format(uriPattern,storeId,leaguerId);
    return this.leaguerDetailDao.getByUri(uri);
  }

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
