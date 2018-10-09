import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {LeaguerInfo} from "./data/LeaguerInfo";
import {LeaguerInfoForm} from "./apiData/LeaguerInfoForm";
import {AppUtils} from "../../comModule/AppUtils";
import {AppCfg} from "../../comModule/AppCfg";


@Injectable()
export class LeaguerWFMgr {
  private leaguerWFDao: LeaguerWFDao;

  constructor(private restProxy: AsyncRestProxy) {
    this.leaguerWFDao = new LeaguerWFDao(restProxy);
  }

  /**
   * 工作流 添加会员
   * @param updateForm
   * @returns {Promise<boolean>}
   */
  public addLeaguerWF(workFlowDataId,leaguerInfoForm:LeaguerInfoForm):Promise<boolean>{
    return this.leaguerWFDao.updateWithId(workFlowDataId,leaguerInfoForm);
  }

  /**
   * 工作流 修改会员
   * @param updateForm
   * @returns {Promise<boolean>}
   */
  public updateLeaguerWF(workFlowDataId,leaguerId,leaguerInfoForm:LeaguerInfoForm):Promise<boolean>{
    let uriPattern = "{0}/{1}";
    let uri = AppUtils.format(uriPattern,workFlowDataId, leaguerId);
    return this.leaguerWFDao.updateWithId(uri,leaguerInfoForm);
  }

}

//会员
export class LeaguerWFDao extends AsyncRestDao<LeaguerInfo> {
  constructor(restProxy: AsyncRestProxy) {
    var table = "workFlowData/leaguerInfo";
    super(LeaguerInfo, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}

