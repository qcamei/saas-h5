import {NgModule} from "@angular/core";
import {PackageProjectDetailCacheDataHolder} from "./chainPackageProjectDetailCacheSynHolder";
import {PackageProjectDetailMgr} from "./chainPackageProjectDetailMgr";
import {ChainPackageProjectMgr} from "./chainPackageProjectMgr";
import {ChainPackageProjectSynDataHolder} from "./chainPackageProjectSynDataHolder";

@NgModule({
  declarations: [],
  imports: [],
  providers: [
    PackageProjectDetailCacheDataHolder,
    PackageProjectDetailMgr,
    ChainPackageProjectMgr,
    ChainPackageProjectSynDataHolder,

  ]
})
export class ChainPackageProjectBsmodule {
}
