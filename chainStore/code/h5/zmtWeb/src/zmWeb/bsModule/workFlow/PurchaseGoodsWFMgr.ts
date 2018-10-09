import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppUtils} from "../../comModule/AppUtils";
import {GoodsRecord} from "./data/GoodsRecord";
import {GoodsRecordAddForm} from "./apiData/GoodsRecordAddForm";
import {GoodsRecordUpdateForm} from "./apiData/GoodsRecordUpdateForm";
import {GoodsRecordAddListForm} from "./apiData/GoodsRecordAddListForm";
import {GoodsRecordUpdListForm} from "./data/GoodsRecordUpdListForm";
import {AppCfg} from "../../comModule/AppCfg";

@Injectable()
export class PurchaseGoodsWFMgr {
  private purchaseGoodsWFDao: PurchaseGoodsWFDao;

  constructor(private restProxy: AsyncRestProxy) {
    this.purchaseGoodsWFDao = new PurchaseGoodsWFDao(restProxy);
  }

  /**
 * 工作流 添加商品列表 统一用修改接口
 * @param addForm
 * @returns {Promise<boolean>}
 */
public addGoodsListWF(workFlowDataId,goodsRecordAddListForm:GoodsRecordAddListForm):Promise<boolean>{
  let uriPath = AppUtils.format("{0}/{1}","addList",workFlowDataId);
  return new Promise<boolean>(resolve => {
    this.purchaseGoodsWFDao.rawReq(uriPath,goodsRecordAddListForm).then((restResp) =>{
      resolve(restResp.code == 200);
    })
  })
}

  /**
   * 工作流 修改商品列表
   * @param updateForm
   * @returns {Promise<boolean>}
   */
  public updateGoodsListWF(workFlowDataId,goodsRecordUpdListForm:GoodsRecordUpdListForm):Promise<boolean>{
    let uriPath = AppUtils.format("{0}/{1}","updList",workFlowDataId);
    return new Promise<boolean>(resolve => {
      this.purchaseGoodsWFDao.rawReq(uriPath,goodsRecordUpdListForm).then((restResp) =>{
        resolve(restResp.code == 200);
      })
    })
  }

  /**
   * 工作流 添加商品
   * @param addForm
   * @returns {Promise<boolean>}
   */
  public addGoodsWF(workFlowDataId,goodsRecordAddForm:GoodsRecordAddForm):Promise<boolean>{
    return new Promise<boolean>(resolve => {
      this.purchaseGoodsWFDao.rawReq(workFlowDataId,goodsRecordAddForm).then((restResp) =>{
        resolve(restResp.code == 200);
      })
    })
  }

  /**
   * 工作流 修改商品信息
   * @param updateForm
   * @returns {Promise<boolean>}
   */
  public updateGoodsWF(workFlowDataId,goodsId,goodsRecordUpdateForm:GoodsRecordUpdateForm):Promise<boolean>{
    let uriPattern = "{0}/{1}";
    let uri = AppUtils.format(uriPattern,workFlowDataId, goodsId);
    return this.purchaseGoodsWFDao.updateWithId(uri,goodsRecordUpdateForm);
  }

  /**
   * 工作流 删除商品
   * @returns {Promise<boolean>}
   */
  public deleteGoodsWF(workFlowDataId,goodsId):Promise<boolean>{
    let uriPattern = "{0}/{1}";
    let uri = AppUtils.format(uriPattern,workFlowDataId, goodsId);
    return this.purchaseGoodsWFDao.delete(uri);
  }

}

//购买商品
export class PurchaseGoodsWFDao extends AsyncRestDao<GoodsRecord> {
  constructor(restProxy: AsyncRestProxy) {
    var table = "workFlowData/goods";
    super(GoodsRecord, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
