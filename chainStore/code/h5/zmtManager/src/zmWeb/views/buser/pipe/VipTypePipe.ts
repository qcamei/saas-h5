import {Pipe, PipeTransform} from '@angular/core';
import {VipLevel} from "../../../bsModule/vipLevel/data/VipLevel";

@Pipe({name: 'vipTypePipe'})
export class VipTypePipe implements PipeTransform {
  transform(type:number,vipLevelList:Array<VipLevel>): string {
    let result = "-";
    if(type && vipLevelList && vipLevelList.length>0){
      for(let item of vipLevelList){
        if(item.id == type){
          result = item.name;
          break;
        }
      }
    }
    return result;
  }
}
