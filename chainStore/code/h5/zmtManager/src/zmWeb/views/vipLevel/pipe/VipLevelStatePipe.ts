import {Pipe, PipeTransform} from "@angular/core";
import {VipLevelStateEnum} from "../../../bsModule/vipLevel/data/VipLevelStateEnum";

@Pipe({name: 'vipLevelStatePipe'})
export class VipLevelStatePipe implements PipeTransform {
  transform(ctrlState:number): string {
    let result = "-";
    if(ctrlState == VipLevelStateEnum.OPEN){
      result = "上架";
    }else if(ctrlState == VipLevelStateEnum.CLOSE) {
      result = "下架";
    }
    return result;
  }
}


@Pipe({name: 'vipLevelStatePipe2'})
export class VipLevelStatePipe2 implements PipeTransform {
  transform(ctrlState:number): string {
    let result = "-";
    if(ctrlState == VipLevelStateEnum.OPEN){
      result = "下架";
    }else if(ctrlState == VipLevelStateEnum.CLOSE) {
      result = "上架";
    }
    return result;
  }
}

