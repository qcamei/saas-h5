import {Pipe, PipeTransform} from '@angular/core';
import {VipLevelType} from "../../../bsModule/vipLevelType/data/VipLevelType";
import {VipLevel} from "../../../bsModule/vipLevel/data/VipLevel";

@Pipe({name: 'vipLevelTypePipe'})
export class VipLevelTypePipe implements PipeTransform {
  transform(vipLevelTypeId:number,vipLevelTypeList:Array<VipLevelType>): string {
    let result = "-";
    if(vipLevelTypeList && vipLevelTypeList.length>0){
      for(let item of vipLevelTypeList){
        if(item.id == vipLevelTypeId){
          result = item.name;
          break;
        }
      }
    }
    return result;
  }
}
