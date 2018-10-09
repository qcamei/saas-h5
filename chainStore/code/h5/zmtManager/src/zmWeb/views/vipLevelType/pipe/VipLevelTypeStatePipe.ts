import {Pipe, PipeTransform} from "@angular/core";
import {VipLevelTypeStateEnum} from "../../../bsModule/vipLevelType/data/VipLevelTypeStateEnum";

@Pipe({name: 'vipLevelTypeStatePipe'})
export class VipLevelTypeStatePipe implements PipeTransform {
  transform(ctrlState:number): string {
    let result = "-";
    if(ctrlState == VipLevelTypeStateEnum.OPEN){
      result = "上架";
    }else if(ctrlState == VipLevelTypeStateEnum.CLOSE) {
      result = "下架";
    }
    return result;
  }
}


@Pipe({name: 'vipLevelTypeStatePipe2'})
export class VipLevelTypeStatePipe2 implements PipeTransform {
  transform(ctrlState:number): string {
    let result = "-";
    if(ctrlState == VipLevelTypeStateEnum.OPEN){
      result = "下架";
    }else if(ctrlState == VipLevelTypeStateEnum.CLOSE) {
      result = "上架";
    }
    return result;
  }
}

