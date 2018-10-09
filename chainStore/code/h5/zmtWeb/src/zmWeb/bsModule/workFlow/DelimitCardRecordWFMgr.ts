import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppUtils} from "../../comModule/AppUtils";
import {ProdRecordUpdateForm} from "./apiData/ProdRecordUpdateForm";
import {ProdRecordAddForm} from "./apiData/ProdRecordAddForm";
import {ProdRecord} from "./data/ProdRecord";
import {ProdRecordAddListForm} from "./apiData/ProdRecordAddListForm";
import {ProdRecordUpdListForm} from "./data/ProdRecordUpdListForm";
import {AppCfg} from "../../comModule/AppCfg";
import {DelimitCardRecordUpdListForm} from "./apiData/DelimitCardRecordUpdListForm";
import {DelimitCardRecordAddForm} from "./apiData/DelimitCardRecordAddForm";
import {DelimitCardRecordUpdateForm} from "./apiData/DelimitCardRecordUpdateForm";
import {DelimitCardRecord} from "./data/DelimitCardRecord";

@Injectable()
export class DelimitCardRecordWFMgr {
  private delimitCardRecordWFDao: DelimitCardRecordWFDao;

  constructor(private restProxy: AsyncRestProxy) {
    this.delimitCardRecordWFDao = new DelimitCardRecordWFDao(restProxy);
  }

  /**
   * 工作流 修改划卡列表
   * @param updateForm
   * @returns {Promise<boolean>}
   */
  public updateDelimitCardRecordListWF(workFlowDataId,delimitCardRecordUpdListForm:DelimitCardRecordUpdListForm):Promise<boolean>{
    let uriPath = AppUtils.format("{0}/{1}","updList",workFlowDataId);
    return new Promise<boolean>(resolve => {
      this.delimitCardRecordWFDao.rawReq(uriPath,delimitCardRecordUpdListForm).then((restResp) =>{
        resolve(restResp.code == 200);
      })
    })
  }

  /**
   * 工作流 添加划卡
   * @param addForm
   * @returns {Promise<boolean>}
   */
  public addDelimitCardRecordWF(workFlowDataId,delimitCardRecordAddForm:DelimitCardRecordAddForm):Promise<boolean>{
    return new Promise<boolean>(resolve => {
      this.delimitCardRecordWFDao.rawReq(workFlowDataId,delimitCardRecordAddForm).then((restResp) =>{
        resolve(restResp.code == 200);
      })
    })
  }

  /**
   * 工作流 修改划卡
   * @param updateForm
   * @returns {Promise<boolean>}
   */
  public updateDelimitCardRecordWF(workFlowDataId,delimitCardId,delimitCardRecordUpdateForm:DelimitCardRecordUpdateForm):Promise<boolean>{
    let uriPattern = "{0}/{1}";
    let uri = AppUtils.format(uriPattern,workFlowDataId, delimitCardId);
    return this.delimitCardRecordWFDao.updateWithId(uri,delimitCardRecordUpdateForm);
  }

  /**
   * 工作流 删除项目
   * @returns {Promise<boolean>}
   */
  public deleteDelimitCardRecordWF(workFlowDataId,delimitCardId):Promise<boolean>{
    let uriPattern = "{0}/{1}";
    let uri = AppUtils.format(uriPattern,workFlowDataId, delimitCardId);
    return this.delimitCardRecordWFDao.delete(uri);
  }

}

//划卡
export class DelimitCardRecordWFDao extends AsyncRestDao<DelimitCardRecord> {
  constructor(restProxy: AsyncRestProxy) {
    var table = "workFlowData/delimitCardRecord";
    super(DelimitCardRecord, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
