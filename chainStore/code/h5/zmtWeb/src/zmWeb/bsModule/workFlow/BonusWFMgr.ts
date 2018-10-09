import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppUtils} from "../../comModule/AppUtils";
import {BonusInfo} from "./data/BonusInfo";
import {BonusInfoAddForm} from "./apiData/BonusInfoAddForm";
import {BonusInfoUpdateForm} from "./apiData/BonusInfoUpdateForm";
import {AppCfg} from "../../comModule/AppCfg";

@Injectable()
export class BonusWFMgr {
  private bonusWFDao: BonusWFDao;

  constructor(private restProxy: AsyncRestProxy) {
    this.bonusWFDao = new BonusWFDao(restProxy);
  }

  /**
   * 工作流 获取提成信息
   * @param addForm
   * @returns {Promise<boolean>}
   */
  // public getBonusWF(workFlowDataId,bonusId):Promise<BonusInfo>{
  //   let uriPattern = "{0}/{1}";
  //   let uri = AppUtils.format(uriPattern,workFlowDataId, bonusId);
  //   return this.bonusWFDao.get(uri);
  // }

  /**
   * 工作流 添加提成
   * @param addForm
   * @returns {Promise<boolean>}
   */
  public addBonusWF(workFlowDataId,bonusInfoAddForm:BonusInfoAddForm):Promise<boolean>{
    return new Promise<boolean>(resolve => {
      this.bonusWFDao.rawReq(workFlowDataId,bonusInfoAddForm).then((restResp) =>{
        resolve(restResp.code == 200);
      })
    })
  }

  /**
   * 工作流 修改提成信息
   * @param updateForm
   * @returns {Promise<boolean>}
   */
  public updateBonusWF(workFlowDataId,bonusId,bonusInfoUpdateForm:BonusInfoUpdateForm):Promise<boolean>{
    let uriPattern = "{0}/{1}";
    let uri = AppUtils.format(uriPattern,workFlowDataId, bonusId);
    return this.bonusWFDao.updateWithId(uri,bonusInfoUpdateForm);
  }

}

//提成
export class BonusWFDao extends AsyncRestDao<BonusInfo> {
  constructor(restProxy: AsyncRestProxy) {
    var table = "workFlowData/bonusInfo";
    super(BonusInfo, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
