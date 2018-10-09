import {Pipe, PipeTransform} from "@angular/core";
import {ValidPeriodUnitEnum} from "../../../bsModule/vipLevel/data/ValidPeriodUnitEnum";


/**
 *有效期单位 枚举-->文字 转换管道
 */

@Pipe({name: 'validPeriodUnitPipe'})
export class ValidPeriodUnitPipe implements PipeTransform {
  transform(unit: number): string {
    let unitName = "";
    if (unit == ValidPeriodUnitEnum.DAY) {
      unitName = "天";
    } else if (unit == ValidPeriodUnitEnum.MONTH) {
      unitName = "个月";
    } else if (unit == ValidPeriodUnitEnum.YEAR) {
      unitName = "年";
    }
    return unitName;
  }
}

