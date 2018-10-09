import {Injectable} from "@angular/core";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AppCfg} from "../../comModule/AppCfg";
import {StorePackageProject} from "./data/StorePackageProject";
import {StorePackageProjectUpdateForm} from "./apiData/StorePackageProjectUpdateForm";
import {PackageProjectRemoveForm} from "./apiData/PackageProjectRemoveForm";
import {StorePackageProjectUpdateType} from "./apiData/StorePackageProjectUpdateType";
import {SessionUtil} from "../../comModule/session/SessionUtil";
import {PackageProjectUpdateForm} from "./apiData/PackageProjectUpdateForm";
import {PackageProjectTypeRemoveForm} from "./apiData/PackageProjectTypeRemoveForm";
import {PackageProjectAddForm} from "./apiData/PackageProjectAddForm";
import {PackageProjectUpdateStateForm} from "./apiData/PackageProjectUpdateStateForm";
import {PackageProjectBatchUpdateStateForm} from "./apiData/PackageProjectBatchUpdateStateForm";
import {PackageProjectTypeAddForm} from "./apiData/PackageProjectTypeAddForm";
import {PackageProjectTypeUpdateForm} from "./apiData/PackageProjectTypeUpdateForm";
import {PackageBatchCancelForm} from "./apiData/PackageBatchCancelForm";
import {PackageBatchPullForm} from "./apiData/PackageBatchPullForm";
import {PackageCancelForm} from "./apiData/PackageCancelForm";
import {PackagePullForm} from "./apiData/PackagePullForm";
import {RestResp} from "../../comModule/RestResp";
import {PkgPrjAddTopForm} from "./apiData/PkgPrjAddTopForm";
import {PkgPrjCancelTopForm} from "./apiData/PkgPrjCancelTopForm";

@Injectable()
export class StorePackageProjectMgr{

  private storePackageDao:StorePackageDao;

  constructor(private restProxy:AsyncRestProxy){
    this.storePackageDao = new StorePackageDao(restProxy);
  }

  public getStorePackageProject(storeId:string):Promise<StorePackageProject> {
    return this.storePackageDao.get(storeId);
  }

  public addPackageProject(addForm:PackageProjectAddForm):Promise<RestResp>{
    let updateForm = new StorePackageProjectUpdateForm();
    updateForm.updateType = StorePackageProjectUpdateType.AddPackageProject;
    updateForm.packageProjectAddForm = addForm;
    return this.updatePackageWithResp(updateForm);
  }

  public deletePackageProject(removeForm:PackageProjectRemoveForm){
    let updateForm = new StorePackageProjectUpdateForm();
    updateForm.updateType = StorePackageProjectUpdateType.RemovePackageProject;
    updateForm.packageProjectRemoveForm = removeForm;
    return this.updatePackage(updateForm);
  }

  public updatePackageProject(editForm:PackageProjectUpdateForm){
    let updateForm = new StorePackageProjectUpdateForm();
    updateForm.updateType = StorePackageProjectUpdateType.UpdatePackageProject;
    updateForm.packageProjectUpdateForm = editForm;
    return this.updatePackage(updateForm);
  }

  public updateState(updateStateForm:PackageProjectUpdateStateForm){
    let updateForm = new StorePackageProjectUpdateForm();
    updateForm.updateType = StorePackageProjectUpdateType.UpdPackageProjectState;
    updateForm.projectUpdateStateForm = updateStateForm;
    return this.updatePackage(updateForm);
  }

  public toTop(toTopForm:PkgPrjAddTopForm){
    let updateForm = new StorePackageProjectUpdateForm();
    updateForm.updateType = StorePackageProjectUpdateType.AddPackageProjectTop;
    updateForm.pkgPrjAddTopForm = toTopForm;
    return this.updatePackage(updateForm);
  }

  public cancelTop(cancelTopForm:PkgPrjCancelTopForm){
    let updateForm = new StorePackageProjectUpdateForm();
    updateForm.updateType = StorePackageProjectUpdateType.CancelPackageProjectTop;
    updateForm.pkgPrjAddTopForm = cancelTopForm;
    return this.updatePackage(updateForm);
  }

  public batchUpdateState(batchUpdateStateForm:PackageProjectBatchUpdateStateForm){
    let updateForm = new StorePackageProjectUpdateForm();
    updateForm.updateType = StorePackageProjectUpdateType.BatchUpdatePackageProjectState;
    updateForm.projectBatchUpdateStateForm = batchUpdateStateForm;
    return this.updatePackage(updateForm);
  }

  /****************************套餐分类*************************************/
  public addPackageProjectType(addForm:PackageProjectTypeAddForm){
    let updateForm = new StorePackageProjectUpdateForm();
    updateForm.updateType = StorePackageProjectUpdateType.AddPackageProjectType;
    updateForm.packageProjectTypeAddForm = addForm;
    return this.updatePackage(updateForm);
  }

  public deletePackageProjectType(removeForm:PackageProjectTypeRemoveForm){
    let updateForm = new StorePackageProjectUpdateForm();
    updateForm.updateType = StorePackageProjectUpdateType.RemovePackageProjectType;
    updateForm.packageProjectTypeRemoveForm = removeForm;
    return this.updatePackage(updateForm);
  }

  public updatePackageProjectType(updateTypeForm:PackageProjectTypeUpdateForm){
    let updateForm = new StorePackageProjectUpdateForm();
    updateForm.updateType = StorePackageProjectUpdateType.UpdatePackageProjectType;
    updateForm.packageProjectTypeUpdateForm = updateTypeForm;
    return this.updatePackage(updateForm);
  }

  public updatePackage(updateForm:StorePackageProjectUpdateForm):Promise<boolean>{
    let storeId = SessionUtil.getInstance().getStoreId();
    return this.storePackageDao.updateWithId(storeId,updateForm);
  }

  public updatePackageWithResp(updateForm:StorePackageProjectUpdateForm):Promise<RestResp>{
    let storeId = SessionUtil.getInstance().getStoreId();
    return this.storePackageDao.update4Resp(storeId,updateForm);
  }

  /**********************************同步连锁店数据***************************************/
  public batchCancelChainPackage(packageBatchCancelForm:PackageBatchCancelForm):Promise<boolean>{
    let updateForm = new StorePackageProjectUpdateForm();
    updateForm.updateType = StorePackageProjectUpdateType.BatchCancelChainPackage;
    updateForm.packageBatchCancelForm = packageBatchCancelForm;
    return this.updatePackage(updateForm);
  }

  public batchPullPackageFromChain(packageBatchPullForm:PackageBatchPullForm):Promise<boolean>{
    let updateForm = new StorePackageProjectUpdateForm();
    updateForm.updateType = StorePackageProjectUpdateType.BatchPullPackageFromChain;
    updateForm.packageBatchPullForm = packageBatchPullForm;
    return this.updatePackage(updateForm);
  }

  public cancelChainPackage(packageCancelForm:PackageCancelForm):Promise<boolean>{
    let updateForm = new StorePackageProjectUpdateForm();
    updateForm.updateType = StorePackageProjectUpdateType.CancelChainPackage;
    updateForm.packageCancelForm = packageCancelForm;
    return this.updatePackage(updateForm);
  }

  public pullPackageFromChain(packagePullForm:PackagePullForm):Promise<boolean>{
    let updateForm = new StorePackageProjectUpdateForm();
    updateForm.updateType = StorePackageProjectUpdateType.PullPackageFromChain;
    updateForm.packagePullForm = packagePullForm;
    return this.updatePackage(updateForm);
  }

}

class StorePackageDao extends AsyncRestDao<StorePackageProject>{
  constructor(restProxy:AsyncRestProxy){
    var table:string = "storePackageProject";
    super(StorePackageProject,restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
