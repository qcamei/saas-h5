import {Pipe, PipeTransform} from "@angular/core";
import {OriginTypeEnum} from "../../../bsModule/appointment/data/OriginTypeEnum";
/**
 * 预约渠道 枚举 -->文字 转换管道
 * @param origin: number
 */

@Pipe({name: 'originTypePipe'})
export class OriginTypePipe implements PipeTransform {
  transform(origin: number): string {
    let text = "";
    origin == OriginTypeEnum.STORE ? text = "自建预约" : text = "会员预约";
    return text;
  }
}
