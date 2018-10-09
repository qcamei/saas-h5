import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppUtils} from "../../comModule/AppUtils";
import {MemCardInfo} from './data/MemCardInfo';
import {MemCardInfoForm} from './apiData/MemCardInfoForm';
import {AppCfg} from "../../comModule/AppCfg";

@Injectable()
export class MemCardInfoWFMgr {
  private memCardInfoWFDao :MemCardInfoWFDao;

  constructor(private restProxy: AsyncRestProxy) {
    this.memCardInfoWFDao = new MemCardInfoWFDao(restProxy);
  }

  /**
   * 工作流 获取会员充值信息
   * @param addForm
   * @returns {Promise<boolean>}
   */
  public getMemCardInfoWF(workFlowDataId,memTypeId):Promise<MemCardInfo>{
    let uriPattern = "{0}/{1}";
    let uri = AppUtils.format(uriPattern,workFlowDataId, memTypeId);
    return this.memCardInfoWFDao.get(uri);
  }

  /**
   * 工作流 添加会员充值信息
   * @param memCardInfoForm
   * @returns {Promise<boolean>}
   */
  public addMemCardInfoWF(workFlowDataId,memCardInfoForm:MemCardInfoForm):Promise<boolean>{
    return new Promise<boolean>(resolve => {
      this.memCardInfoWFDao.rawReq(workFlowDataId,memCardInfoForm).then((restResp) =>{
        resolve(restResp.code == 200);
      })
    })
  }

  /**
   * 工作流 修改会员充值信息
   * @param updateForm
   * @returns {Promise<boolean>}
   */
  public updateMemCardInfoWF(workFlowDataId,memTypeId,memCardInfoForm:MemCardInfoForm):Promise<boolean>{
    let uriPattern = "{0}/{1}";
    let uri = AppUtils.format(uriPattern,workFlowDataId, memTypeId);
    return this.memCardInfoWFDao.updateWithId(uri,memCardInfoForm);
  }
}

//会员充值信息
export class MemCardInfoWFDao extends AsyncRestDao<MemCardInfo> {
  constructor(restProxy: AsyncRestProxy) {
    var table = "workFlowData/memCardInfo";
    super(MemCardInfo, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
