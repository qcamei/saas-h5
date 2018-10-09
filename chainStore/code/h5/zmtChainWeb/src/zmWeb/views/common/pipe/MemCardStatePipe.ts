import {Pipe, PipeTransform} from "@angular/core";
import {CardStatusEnum} from "../../../bsModule/chainCard/data/CardStatusEnum";

/**
 * 会员卡状态 枚举 -->文字 转换管道
 * @param status: number
 */

@Pipe({name: 'memCardStatePipe'})
export class MemCardStatePipe implements PipeTransform {
  transform(state: string): string {
    if(typeof (state)=="string"){
      if (parseInt(state) === CardStatusEnum.OPEN) {
        return "启用";
      } else if (parseInt(state) === CardStatusEnum.CLOSE) {
        return "停用";
      }
    }else if(typeof (state)=="number"){
      if (state === CardStatusEnum.OPEN) {
        return "启用";
      } else if (state === CardStatusEnum.CLOSE) {
        return "停用";
      }
    }
  }
}

@Pipe({name: 'memCardStatePipe2'})
export class MemCardStatePipe2 implements PipeTransform {
  transform(state: string): string {
    if(typeof (state)=="string"){
      if (parseInt(state) === CardStatusEnum.OPEN) {
        return "停用";
      } else if (parseInt(state) === CardStatusEnum.CLOSE) {
        return "启用";
      }
    }else if(typeof (state)=="number"){
      if (state === CardStatusEnum.OPEN) {
        return "停用";
      } else if (state === CardStatusEnum.CLOSE) {
        return "启用";
      }
    }
  }
}
