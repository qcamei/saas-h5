import {Pipe, PipeTransform} from "@angular/core";


/**
 * 次卡有效期 枚举-->文字 转换管道
 */

@Pipe({name: 'validPeriodUnitPipe'})
export class ValidPeriodUnitPipe implements PipeTransform {
  transform(unit: number): string {
    let unitName = "";
    if (unit == 0) {
      unitName = "永久";
    } else if (unit == 1) {
      unitName = "天";
    } else if (unit == 2) {
      unitName = "个月";
    } else if (unit == 3) {
      unitName = "年";
    }
    return unitName;
  }
}

