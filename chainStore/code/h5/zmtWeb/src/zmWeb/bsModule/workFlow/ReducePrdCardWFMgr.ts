import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppUtils} from "../../comModule/AppUtils";
import {DecreasePrdCardRecord} from "./data/DecreasePrdCardRecord";
import {DecreasePrdCardAddForm} from "./apiData/DecreasePrdCardAddForm";
import {DecreasePrdCardUpdateForm} from "./apiData/DecreasePrdCardUpdateForm";
import {DecreasePrdCardAddListForm} from "./apiData/DecreasePrdCardAddListForm";
import {DecreasePrdCardUpdListForm} from "./data/DecreasePrdCardUpdListForm";
import {AppCfg} from "../../comModule/AppCfg";


@Injectable()
export class ReducePrdCardWFMgr {
  private reducePrdCardWFDao: ReducePrdCardWFDao;

  constructor(private restProxy: AsyncRestProxy) {
    this.reducePrdCardWFDao = new ReducePrdCardWFDao(restProxy);
  }

  /**
   * 工作流 添加划卡项目列表 统一用修改接口
   * @param addForm
   * @returns {Promise<boolean>}
   */
  public addPrdCardListWF(workFlowDataId,decreasePrdCardAddListForm:DecreasePrdCardAddListForm):Promise<boolean>{
    let uriPath = AppUtils.format("{0}/{1}","addList",workFlowDataId);
    return new Promise<boolean>(resolve => {
      this.reducePrdCardWFDao.rawReq(uriPath,decreasePrdCardAddListForm).then((restResp) =>{
        resolve(restResp.code == 200);
      })
    })
  }

  /**
   * 工作流 修改划卡项目列表
   * @param updateForm
   * @returns {Promise<boolean>}
   */
  public updatePrdCardListWF(workFlowDataId,decreasePrdCardUpdListForm:DecreasePrdCardUpdListForm):Promise<boolean>{
    let uriPath = AppUtils.format("{0}/{1}","updList",workFlowDataId);
    return new Promise<boolean>(resolve => {
      this.reducePrdCardWFDao.rawReq(uriPath,decreasePrdCardUpdListForm).then((restResp) =>{
        resolve(restResp.code == 200);
      })
    })
  }

  /**
   * 工作流 添加划卡项目
   * @param addForm
   * @returns {Promise<boolean>}
   */
  public addPrdCardWF(workFlowDataId,decreasePrdCardAddForm:DecreasePrdCardAddForm):Promise<boolean>{
    return new Promise<boolean>(resolve => {
      this.reducePrdCardWFDao.rawReq(workFlowDataId,decreasePrdCardAddForm).then((restResp) =>{
        resolve(restResp.code == 200);
      })
    })
  }

  /**
   * 工作流 修改划卡项目
   * @param updateForm
   * @returns {Promise<boolean>}
   */
  public updatePrdCardWF(workFlowDataId,decreasePrdCardId,decreasePrdCardUpdateForm:DecreasePrdCardUpdateForm):Promise<boolean>{
    let uriPattern = "{0}/{1}";
    let uri = AppUtils.format(uriPattern,workFlowDataId, decreasePrdCardId);
    return this.reducePrdCardWFDao.updateWithId(uri,decreasePrdCardUpdateForm);
  }

  /**
   * 工作流 删除会员划卡项目
   * @returns {Promise<boolean>}
   */
  public deletePrdCardWF(workFlowDataId,decreasePrdCardId):Promise<boolean>{
    let uriPattern = "{0}/{1}";
    let uri = AppUtils.format(uriPattern,workFlowDataId, decreasePrdCardId);
    return this.reducePrdCardWFDao.delete(uri);
  }

}

//划卡
export class ReducePrdCardWFDao extends AsyncRestDao<DecreasePrdCardRecord> {
  constructor(restProxy: AsyncRestProxy) {
    var table = "workFlowData/decreasePrdCard";
    super(DecreasePrdCardRecord, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}

