import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppUtils} from "../../comModule/AppUtils";
import {PrdCardRecord} from "./data/PrdCardRecord";
import {PrdCardAddForm} from "./apiData/PrdCardAddForm";
import {PrdCardUpdateForm} from "./apiData/PrdCardUpdateForm";
import {PrdCardAddListForm} from "./apiData/PrdCardAddListForm";
import {PrdCardUpdListForm} from "./data/PrdCardUpdListForm";
import {AppCfg} from "../../comModule/AppCfg";


@Injectable()
export class PurchasePrdCardWFMgr {
  private purchasePrdCardWFDao: PurchasePrdCardWFDao;

  constructor(private restProxy: AsyncRestProxy) {
    this.purchasePrdCardWFDao = new PurchasePrdCardWFDao(restProxy);
  }

  /**
   * 工作流 添加次卡列表 统一用修改接口
   * @param addForm
   * @returns {Promise<boolean>}
   */
  public addCardListWF(workFlowDataId,prdCardAddListForm:PrdCardAddListForm):Promise<boolean>{
    let uriPath = AppUtils.format("{0}/{1}","addList",workFlowDataId);
    return new Promise<boolean>(resolve => {
      this.purchasePrdCardWFDao.rawReq(uriPath,prdCardAddListForm).then((restResp) =>{
        resolve(restResp.code == 200);
      })
    })
  }

  /**
   * 工作流 修改次卡列表
   * @param updateForm
   * @returns {Promise<boolean>}
   */
  public updateCardListWF(workFlowDataId,prdCardUpdListForm:PrdCardUpdListForm):Promise<boolean>{
    let uriPath = AppUtils.format("{0}/{1}","updList",workFlowDataId);
    return new Promise<boolean>(resolve => {
      this.purchasePrdCardWFDao.rawReq(uriPath,prdCardUpdListForm).then((restResp) =>{
        resolve(restResp.code == 200);
      })
    })
  }

  /**
   * 工作流 添加次卡
   * @param addForm
   * @returns {Promise<boolean>}
   */
  public addProductCardWF(workFlowDataId,prdCardAddForm:PrdCardAddForm):Promise<boolean>{
    return new Promise<boolean>(resolve => {
      this.purchasePrdCardWFDao.rawReq(workFlowDataId,prdCardAddForm).then((restResp) =>{
        resolve(restResp.code == 200);
      })
    })
  }

  /**
   * 工作流 修改次卡信息
   * @param updateForm
   * @returns {Promise<boolean>}
   */
  public updateProductCardWF(workFlowDataId,prdCardId,prdCardUpdateForm:PrdCardUpdateForm):Promise<boolean>{
    let uriPattern = "{0}/{1}";
    let uri = AppUtils.format(uriPattern,workFlowDataId, prdCardId);
    return this.purchasePrdCardWFDao.updateWithId(uri,prdCardUpdateForm);
  }

  /**
   * 工作流 删除次卡
   * @returns {Promise<boolean>}
   */
  public deleteProductCardWF(workFlowDataId, prdCardId):Promise<boolean>{
    let uriPattern = "{0}/{1}";
    let uri = AppUtils.format(uriPattern,workFlowDataId, prdCardId);
    return this.purchasePrdCardWFDao.delete(uri);
  }

}

//购买次卡
export class PurchasePrdCardWFDao extends AsyncRestDao<PrdCardRecord> {
  constructor(restProxy: AsyncRestProxy) {
    var table = "workFlowData/prdCard";
    super(PrdCardRecord, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
