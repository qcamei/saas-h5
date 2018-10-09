import {Pipe, PipeTransform} from "@angular/core";
import {CardStatusEnum} from "../../../bsModule/storeCardInfo/data/CardStatusEnum";

/**
 * 次卡状态 枚举 -->文字 转换管道
 * @param status: number
 */

@Pipe({name: 'prdCardStatePipe'})
export class PrdCardStatePipe implements PipeTransform {
  transform(status: number): string {
    if (status == CardStatusEnum.CLOSE) {
      return "下架";
    } else if (status == CardStatusEnum.OPEN) {
      return "上架";
    }
  }
}

@Pipe({name: 'prdCardStatePipe2'})
export class PrdCardStatePipe2 implements PipeTransform {
  transform(status: number): string {
    if (status == CardStatusEnum.CLOSE) {
      return "上架";
    } else if (status == CardStatusEnum.OPEN) {
      return "下架";
    }
  }
}
