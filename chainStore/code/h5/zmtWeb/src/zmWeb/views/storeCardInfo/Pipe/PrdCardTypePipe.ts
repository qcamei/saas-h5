import {Pipe, PipeTransform} from "@angular/core";


/**
 * 次卡类型 枚举-->文字 转换管道
 */

@Pipe({name: 'prdCardTypePipe'})
export class PrdCardTypePipe implements PipeTransform {
  transform(type: number): string {
    let typeName: string = "";
    if (type == 0) {
      typeName = "指定项目及次数";
    } else if (type == 1) {
      typeName = "不限项目限次数";
    } else if (type == 2) {
      typeName = "不限项目不限次数";
    }
    return typeName;
  }
}

