

import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {ChainPackageProject} from "./data/ChainPackageProject";
import {PackageProjectAddForm} from "./apiData/PackageProjectAddForm";
import {ChainPackageProjectUpdateForm} from "./apiData/ChainPackageProjectUpdateForm";
import {ChainPackageProjectUpdateType} from "./apiData/ChainPackageProjectUpdateType";
import {PackageProjectRemoveForm} from "./apiData/PackageProjectRemoveForm";
import {PackageProjectUpdateForm} from "./apiData/PackageProjectUpdateForm";
import {PackageProjectUpdateStateForm} from "./apiData/PackageProjectUpdateStateForm";
import {PackageProjectBatchUpdateStateForm} from "./apiData/PackageProjectBatchUpdateStateForm";
import {PackageProjectTypeAddForm} from "./apiData/PackageProjectTypeAddForm";
import {PackageProjectTypeRemoveForm} from "./apiData/PackageProjectTypeRemoveForm";
import {PackageProjectTypeUpdateForm} from "./apiData/PackageProjectTypeUpdateForm";
import {SessionUtil} from "../../comModule/session/SessionUtil";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppCfg} from "../../comModule/AppCfg";
import {PackageProjectAllotForm} from "./apiData/PackageProjectAllotForm";
import {PackageProjectBatchAllotForm} from "./apiData/PackageProjectBatchAllotForm";

@Injectable()
export class ChainPackageProjectMgr{

  private chainPackageDao:ChainPackageDao;

  constructor(private restProxy:AsyncRestProxy){
    this.chainPackageDao = new ChainPackageDao(restProxy);
  }

  public getChainPackageProject(chainId:string):Promise<ChainPackageProject> {
    return this.chainPackageDao.get(chainId);
  }

  public addPackageProject(addForm:PackageProjectAddForm){
    let updateForm = new ChainPackageProjectUpdateForm();
    updateForm.updateType = ChainPackageProjectUpdateType.AddPackageProject;
    updateForm.packageProjectAddForm = addForm;
    return this.updatePackage(updateForm);
  }

  public deletePackageProject(removeForm:PackageProjectRemoveForm){
    let updateForm = new ChainPackageProjectUpdateForm();
    updateForm.updateType = ChainPackageProjectUpdateType.RemovePackageProject;
    updateForm.packageProjectRemoveForm = removeForm;
    return this.updatePackage(updateForm);
  }

  public updatePackageProject(editForm:PackageProjectUpdateForm){
    let updateForm = new ChainPackageProjectUpdateForm();
    updateForm.updateType = ChainPackageProjectUpdateType.UpdatePackageProject;
    updateForm.packageProjectUpdateForm = editForm;
    return this.updatePackage(updateForm);
  }

  public updateState(updateStateForm:PackageProjectUpdateStateForm){
    let updateForm = new ChainPackageProjectUpdateForm();
    updateForm.updateType = ChainPackageProjectUpdateType.UpdPackageProjectState;
    updateForm.projectUpdateStateForm = updateStateForm;
    return this.updatePackage(updateForm);
  }

  public batchUpdateState(batchUpdateStateForm:PackageProjectBatchUpdateStateForm){
    let updateForm = new ChainPackageProjectUpdateForm();
    updateForm.updateType = ChainPackageProjectUpdateType.BatchUpdatePackageProjectState;
    updateForm.projectBatchUpdateStateForm = batchUpdateStateForm;
    return this.updatePackage(updateForm);
  }

  public addPackageProjectType(addForm:PackageProjectTypeAddForm){
    let updateForm = new ChainPackageProjectUpdateForm();
    updateForm.updateType = ChainPackageProjectUpdateType.AddPackageProjectType;
    updateForm.packageProjectTypeAddForm = addForm;
    return this.updatePackage(updateForm);
  }

  public deletePackageProjectType(removeForm:PackageProjectTypeRemoveForm){
    let updateForm = new ChainPackageProjectUpdateForm();
    updateForm.updateType = ChainPackageProjectUpdateType.RemovePackageProjectType;
    updateForm.packageProjectTypeRemoveForm = removeForm;
    return this.updatePackage(updateForm);
  }

  public updatePackageProjectType(updateTypeForm:PackageProjectTypeUpdateForm){
    let updateForm = new ChainPackageProjectUpdateForm();
    updateForm.updateType = ChainPackageProjectUpdateType.UpdatePackageProjectType;
    updateForm.packageProjectTypeUpdateForm = updateTypeForm;
    return this.updatePackage(updateForm);
  }

  public allotStore(packageProjectAllotForm:PackageProjectAllotForm){
    let updateForm = new ChainPackageProjectUpdateForm();
    updateForm.updateType = ChainPackageProjectUpdateType.AllotStore;
    updateForm.packageProjectAllotForm = packageProjectAllotForm;
    return this.updatePackage(updateForm);
  }

  public batchAllotStore(packageProjectBatchAllotForm:PackageProjectBatchAllotForm){
    let updateForm = new ChainPackageProjectUpdateForm();
    updateForm.updateType = ChainPackageProjectUpdateType.BatchAllotStore;
    updateForm.packageProjectBatchAllotForm = packageProjectBatchAllotForm;
    return this.updatePackage(updateForm);
  }

  public updatePackage(updateForm:ChainPackageProjectUpdateForm):Promise<boolean>{
    let chainId = SessionUtil.getInstance().getChainId();
    return this.chainPackageDao.updateWithId(chainId,updateForm);
  }

}

class ChainPackageDao extends AsyncRestDao<ChainPackageProject>{
  constructor(restProxy:AsyncRestProxy){
    var table:string = "chainPackageProject";
    super(ChainPackageProject,restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
