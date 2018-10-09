import {AppUtils, ZmMap} from "../../comModule/AppUtils";
import {MgrPool} from "../../comModule/MgrPool";
import {StorePackageProject} from "./data/StorePackageProject";
import {PackageProject} from "./data/PackageProject";
import {PackageProjectType} from "./data/PackageProjectType";

export class StorePackageProjectHelper {

  public static getInstance(): StorePackageProjectHelper {
    return MgrPool.getInstance().get("StorePackageProjectHelper", StorePackageProjectHelper);
  }

  /**
   * 根据 packageProjectId 获取 PackageProject
   *
   * @param storePackageProject
   * @param packageProjectId
   * @return
   */
  public getPackageProjectById(storePackageProject: StorePackageProject, packageProjectId: string): PackageProject {
    if (AppUtils.isNullObj(storePackageProject)) return null;
    let packageProjectMap: ZmMap<PackageProject> = storePackageProject.getAllPackageProjectMap();
    let packageProject: PackageProject = packageProjectMap.get(packageProjectId);
    return packageProject;
  }

  /**
   * 根据 id 获取 PackageProjectType
   * @param {StorePackageProject} storePackageProject
   * @param {string} packageProjectTypeId
   * @returns {PackageProjectType}
   */
  public getPackageProjectTypeById(storePackageProject: StorePackageProject, packageProjectTypeId: string): PackageProjectType{
    if (AppUtils.isNullObj(storePackageProject)) return null;
    let packageProjectTypeMap: ZmMap<PackageProjectType> = storePackageProject.getAllPackageTypeMap();
    let packageProjectType: PackageProjectType = packageProjectTypeMap.get(packageProjectTypeId);
    return packageProjectType;
  }
}
