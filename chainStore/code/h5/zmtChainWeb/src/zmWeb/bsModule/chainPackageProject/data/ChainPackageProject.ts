import {ZmMap, AppUtils} from "../../../comModule/AppUtils";
import {PackageProject} from "./PackageProject";
import {EntityStateEnum} from "../../../comModule/enum/EntityStateEnum";
import {PackageStateEnum} from "./PackageStateEnum";
import {PackageProjectType} from "./PackageProjectType";
export class ChainPackageProject {
    constructor(){}
    id:number;
    chainId:number;
    packageProjectIndex:number;
    packageProjectMap:any;
    packageProjectTypeIndex:number;
   packageProjectTypeMap:any;
    createdTime:number;
    lastUpdateTime:number;
    ver:number;

  public getAllPackageProjectMap() {
    let targetMapTmp = this.packageProjectMap;
    let targetMap = new ZmMap<PackageProject>();
    for (let index in targetMapTmp) {
      let targetTmp = targetMapTmp[index];
      let packageProject = new PackageProject();
      AppUtils.copy(packageProject,targetTmp);
      targetMap.put(packageProject.id,packageProject);
    }
    return targetMap;
  }

  public getValidPackageProjectMap() {
    let targetMapTmp = this.packageProjectMap;
    let targetMap = new ZmMap<PackageProject>();
    for (let index in targetMapTmp) {
      let targetTmp = targetMapTmp[index];
      let packageProject = new PackageProject();
      if(targetTmp.entityState == EntityStateEnum.Normal) {
        AppUtils.copy(packageProject, targetTmp);
        targetMap.put(packageProject.id, packageProject);
      }
    }
    return targetMap;
  }

  public getOpenPackageProjectMap() {
    let targetMapTmp = this.packageProjectMap;
    let targetMap = new ZmMap<PackageProject>();
    for (let index in targetMapTmp) {
      let targetTmp = targetMapTmp[index];
      if(targetTmp.entityState == EntityStateEnum.Normal && targetTmp.state == PackageStateEnum.Open){
        targetMap.put(targetTmp.id,targetTmp);
      }
    }
    return targetMap;
  }

  public getAllPackageTypeMap() {
    let targetMapTmp = this.packageProjectTypeMap;
    let targetMap = new ZmMap<PackageProjectType>();
    for (let index in targetMapTmp) {
      let packageProjectType = targetMapTmp[index];
      targetMap.put(packageProjectType.id,packageProjectType);
    }
    return targetMap;
  }

  public getValidPackageTypeMap() {
    let targetMapTmp = this.packageProjectTypeMap;
    let targetMap = new ZmMap<PackageProjectType>();
    for (let index in targetMapTmp) {
      let packageProjectTypeTmp = targetMapTmp[index];
      if(packageProjectTypeTmp.entityState == EntityStateEnum.Normal) {
        let packageProjectType = new PackageProjectType();
        AppUtils.copy(packageProjectType,packageProjectTypeTmp);
        targetMap.put(packageProjectType.id.toString(), packageProjectType);
      }
    }
    return targetMap;
  }

}
