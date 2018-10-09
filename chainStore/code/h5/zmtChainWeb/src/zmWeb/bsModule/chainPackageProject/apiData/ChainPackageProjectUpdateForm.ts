import {PackageProjectAddForm} from "./PackageProjectAddForm";
import {PackageProjectRemoveForm} from "./PackageProjectRemoveForm";
import {PackageProjectUpdateForm} from "./PackageProjectUpdateForm";
import {PackageProjectUpdateStateForm} from "./PackageProjectUpdateStateForm";
import {PackageProjectBatchUpdateStateForm} from "./PackageProjectBatchUpdateStateForm";
import {PackageProjectTypeAddForm} from "./PackageProjectTypeAddForm";
import {PackageProjectTypeRemoveForm} from "./PackageProjectTypeRemoveForm";
import {PackageProjectTypeUpdateForm} from "./PackageProjectTypeUpdateForm";
import {PackageProjectAllotForm} from "./PackageProjectAllotForm";
import {PackageProjectBatchAllotForm} from "./PackageProjectBatchAllotForm";
export class ChainPackageProjectUpdateForm {
    constructor(){}
    updateType:number;
    packageProjectAddForm:PackageProjectAddForm;
    packageProjectRemoveForm:PackageProjectRemoveForm;
    packageProjectUpdateForm:PackageProjectUpdateForm;
    projectUpdateStateForm:PackageProjectUpdateStateForm;
    projectBatchUpdateStateForm:PackageProjectBatchUpdateStateForm;

    packageProjectTypeAddForm:PackageProjectTypeAddForm;
    packageProjectTypeRemoveForm:PackageProjectTypeRemoveForm;
    packageProjectTypeUpdateForm:PackageProjectTypeUpdateForm;

    packageProjectAllotForm:PackageProjectAllotForm;
    packageProjectBatchAllotForm:PackageProjectBatchAllotForm;
}
