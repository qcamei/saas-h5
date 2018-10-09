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
import {PackagePrjRecord} from "./data/PackagePrjRecord";
import {PackagePrjRecordAddForm} from "./apiData/PackagePrjRecordAddForm";
import {PackagePrjRecordUpdateForm} from "./apiData/PackagePrjRecordUpdateForm";
import {PackagePrjRecordUpdListForm} from "./apiData/PackagePrjRecordUpdListForm";

@Injectable()
export class PackageRecordWFMgr {
  private packageRecordWFDao: PackageRecordWFDao;

  constructor(private restProxy: AsyncRestProxy) {
    this.packageRecordWFDao = new PackageRecordWFDao(restProxy);
  }

  /**
   * 工作流 修改套餐列表
   * @param updateForm
   * @returns {Promise<boolean>}
   */
  public updatePackageListWF(workFlowDataId,packagePrjRecordUpdListForm:PackagePrjRecordUpdListForm):Promise<boolean>{
    let uriPath = AppUtils.format("{0}/{1}","updList",workFlowDataId);
    return new Promise<boolean>(resolve => {
      this.packageRecordWFDao.rawReq(uriPath,packagePrjRecordUpdListForm).then((restResp) =>{
        resolve(restResp.code == 200);
      })
    })
  }

  /**
   * 工作流 添加套餐
   * @param addForm
   * @returns {Promise<boolean>}
   */
  public addPackageWF(workFlowDataId,packagePrjRecordAddForm:PackagePrjRecordAddForm):Promise<boolean>{
    return new Promise<boolean>(resolve => {
      this.packageRecordWFDao.rawReq(workFlowDataId,packagePrjRecordAddForm).then((restResp) =>{
        resolve(restResp.code == 200);
      })
    })
  }

  /**
   * 工作流 修改套餐信息
   * @param updateForm
   * @returns {Promise<boolean>}
   */
  public updatePackageWF(workFlowDataId,packageId,packagePrjRecordUpdateForm:PackagePrjRecordUpdateForm):Promise<boolean>{
    let uriPattern = "{0}/{1}";
    let uri = AppUtils.format(uriPattern,workFlowDataId, packageId);
    return this.packageRecordWFDao.updateWithId(uri,packagePrjRecordUpdateForm);
  }

  /**
   * 工作流 删除套餐
   * @returns {Promise<boolean>}
   */
  public deletePackageWF(workFlowDataId,packageId):Promise<boolean>{
    let uriPattern = "{0}/{1}";
    let uri = AppUtils.format(uriPattern,workFlowDataId, packageId);
    return this.packageRecordWFDao.delete(uri);
  }

}

//购买套餐
export class PackageRecordWFDao extends AsyncRestDao<PackagePrjRecord> {
  constructor(restProxy: AsyncRestProxy) {
    var table = "workFlowData/packagePrjRecord";
    super(PackagePrjRecord, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
