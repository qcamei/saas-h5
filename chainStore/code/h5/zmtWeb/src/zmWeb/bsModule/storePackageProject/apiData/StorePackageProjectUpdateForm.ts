import {PackageProjectAddForm} from "./PackageProjectAddForm";
import {PackageProjectRemoveForm} from "./PackageProjectRemoveForm";
import {PackageProjectUpdateForm} from "./PackageProjectUpdateForm";
import {PackageProjectUpdateStateForm} from "./PackageProjectUpdateStateForm";
import {PackageProjectBatchUpdateStateForm} from "./PackageProjectBatchUpdateStateForm";
import {PackageProjectTypeAddForm} from "./PackageProjectTypeAddForm";
import {PackageProjectTypeRemoveForm} from "./PackageProjectTypeRemoveForm";
import {PackageProjectTypeUpdateForm} from "./PackageProjectTypeUpdateForm";
import {PackageBatchCancelForm} from "./PackageBatchCancelForm";
import {PackageBatchPullForm} from "./PackageBatchPullForm";
import {PackageCancelForm} from "./PackageCancelForm";
import {PackagePullForm} from "./PackagePullForm";
import {PkgPrjAddTopForm} from "./PkgPrjAddTopForm";
import {PkgPrjCancelTopForm} from "./PkgPrjCancelTopForm";
export class StorePackageProjectUpdateForm {
  constructor() {
  }

  updateType: number;

  packageProjectAddForm: PackageProjectAddForm;
  packageProjectRemoveForm: PackageProjectRemoveForm;
  packageProjectUpdateForm: PackageProjectUpdateForm;
  projectUpdateStateForm: PackageProjectUpdateStateForm;
  projectBatchUpdateStateForm: PackageProjectBatchUpdateStateForm;

  packageProjectTypeAddForm: PackageProjectTypeAddForm;
  packageProjectTypeRemoveForm: PackageProjectTypeRemoveForm;
  packageProjectTypeUpdateForm: PackageProjectTypeUpdateForm;

  pkgPrjAddTopForm: PkgPrjAddTopForm;
  pkgPrjCancelTopForm: PkgPrjCancelTopForm;

  /**********************************同步连锁店数据***************************************/
  packageBatchCancelForm: PackageBatchCancelForm;
  packageBatchPullForm: PackageBatchPullForm;
  packageCancelForm: PackageCancelForm;
  packagePullForm: PackagePullForm;
}
