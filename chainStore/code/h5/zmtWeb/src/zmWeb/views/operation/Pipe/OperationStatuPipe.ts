import {Pipe, PipeTransform} from "@angular/core";

/**
 * 流程状态枚举-->文字 转换管道
 */

@Pipe({name: 'operationStatePipe'})
export class OperationStatePipe implements PipeTransform {
  transform(status: number): string {
    if (status == 1) {
      return "已完成";
    } else if (status == 0) {
      return "进行中";
    }
  }
}

