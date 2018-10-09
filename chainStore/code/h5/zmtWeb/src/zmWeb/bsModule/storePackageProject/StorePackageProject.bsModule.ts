import {NgModule} from "@angular/core";
import {StorePackageProjectMgr} from "./StorePackageProjectMgr";
import {StorePackageProjectSynDataHolder} from "./StorePackageProjectSynDataHolder";
import {PackageProjectDetailBSmodule} from "../packageProjectDetail/packageProjectDetail.bsmodule";

@NgModule({
  declarations:[

  ],
  imports:[
    PackageProjectDetailBSmodule,
  ],
  providers:[
    StorePackageProjectMgr,
    StorePackageProjectSynDataHolder
  ]
})
export  class StorePackageProjectBSModule{}
