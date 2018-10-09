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

@Injectable()
export class ProductWFMgr {
  private productWFDao: ProductWFDao;

  constructor(private restProxy: AsyncRestProxy) {
    this.productWFDao = new ProductWFDao(restProxy);
  }

  /**
   * 工作流 添加项目列表 统一用修改接口
   * @param addForm
   * @returns {Promise<boolean>}
   */
  public addProductListWF(workFlowDataId,prodRecordAddListForm:ProdRecordAddListForm):Promise<boolean>{
    let uriPath = AppUtils.format("{0}/{1}","addList",workFlowDataId);
    return new Promise<boolean>(resolve => {
      this.productWFDao.rawReq(uriPath,prodRecordAddListForm).then((restResp) =>{
        resolve(restResp.code == 200);
      })
    })
  }

  /**
   * 工作流 修改项目列表
   * @param updateForm
   * @returns {Promise<boolean>}
   */
  public updateProductListWF(workFlowDataId,prodRecordUpdListForm:ProdRecordUpdListForm):Promise<boolean>{
    let uriPath = AppUtils.format("{0}/{1}","updList",workFlowDataId);
    return new Promise<boolean>(resolve => {
      this.productWFDao.rawReq(uriPath,prodRecordUpdListForm).then((restResp) =>{
        resolve(restResp.code == 200);
      })
    })
  }

  /**
   * 工作流 添加项目
   * @param addForm
   * @returns {Promise<boolean>}
   */
  public addProductWF(workFlowDataId,prodRecordAddForm:ProdRecordAddForm):Promise<boolean>{
    return new Promise<boolean>(resolve => {
      this.productWFDao.rawReq(workFlowDataId,prodRecordAddForm).then((restResp) =>{
        resolve(restResp.code == 200);
      })
    })
  }

  /**
   * 工作流 修改项目
   * @param updateForm
   * @returns {Promise<boolean>}
   */
  public updateProductWF(workFlowDataId,productId,prodRecordUpdateForm:ProdRecordUpdateForm):Promise<boolean>{
    let uriPattern = "{0}/{1}";
    let uri = AppUtils.format(uriPattern,workFlowDataId, productId);
    return this.productWFDao.updateWithId(uri,prodRecordUpdateForm);
  }

  /**
   * 工作流 删除项目
   * @returns {Promise<boolean>}
   */
  public deleteProductWF(workFlowDataId,productId):Promise<boolean>{
    let uriPattern = "{0}/{1}";
    let uri = AppUtils.format(uriPattern,workFlowDataId, productId);
    return this.productWFDao.delete(uri);
  }

}

//项目
export class ProductWFDao extends AsyncRestDao<ProdRecord> {
  constructor(restProxy: AsyncRestProxy) {
    var table = "workFlowData/product";
    super(ProdRecord, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
