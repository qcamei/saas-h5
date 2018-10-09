import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {PackageProject} from "./PackageProject";
import {EntityStateEnum} from "../../StoreProductInfo/data/EntityStateEnum";
import {PackageStateEnum} from "./PackageStateEnum";
import {PackageProjectType} from "./PackageProjectType";
export class StorePackageProject {
    constructor(){}
    id:number;
    storeId:number;
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



  //套餐分类详情
  public getPackageTypeDetail(prdTypeId:string):PackageProjectType{
    let typeList:Array<PackageProjectType> = this.getAllPackageTypeMap().values();
    let typeTmp:PackageProjectType = new PackageProjectType();
    for (let type of typeList){
      if(prdTypeId == type.id){
        typeTmp = type;
        break;
      }
    }
    return typeTmp;
  }

  //Map<id,name>
  public getTypeMap() {
    let targetMapTmp = this.packageProjectTypeMap;
    let targetMap = new ZmMap<string>();
    for (let index in targetMapTmp) {
      let productType = targetMapTmp[index];
      targetMap.put(productType.id,productType.name);
    }
    return targetMap;
  }


}
