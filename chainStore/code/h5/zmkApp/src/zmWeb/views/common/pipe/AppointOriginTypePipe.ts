import {Pipe, PipeTransform} from "@angular/core";
import {OriginTypeEnum} from "../../../bsModule/appointment/data/OriginTypeEnum";
/**
 * 预约渠道 枚举 -->文字 转换管道
 * @param origin: number
 */

@Pipe({name: 'appointOriginTypePipe'})
export class AppointOriginTypePipe implements PipeTransform {
  transform(origin: number): string {
    if (origin == OriginTypeEnum.UNKNOW) {
      return "未知";
    } else if (origin == OriginTypeEnum.STORE) {
      return "自建预约";
    } else if (origin == OriginTypeEnum.CUSTOMER) {
      return "会员预约";
    }
  }
}
