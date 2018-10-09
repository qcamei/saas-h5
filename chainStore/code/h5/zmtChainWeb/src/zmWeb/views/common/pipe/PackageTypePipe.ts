import {Pipe, PipeTransform} from "@angular/core";
import {ZmMap} from "../../../comModule/AppUtils";
import {PackageProjectType} from "../../../bsModule/chainPackageProject/data/PackageProjectType";


/**
 * 套餐分类ID -->套餐分类名称 转换管道
 */

@Pipe({name: 'packageTypePipe'})
export class PackageTypePipe implements PipeTransform {

  constructor() {
  }

  transform(typeId:string,packageTypeMap:ZmMap<PackageProjectType>){
    let target = "";
    if(typeId && packageTypeMap){
      let packageType = packageTypeMap.get(typeId);
      if(packageType){
        target = packageType.name;
      }
    }
    return target;
  }
}

