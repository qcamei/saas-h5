import {Pipe, PipeTransform} from "@angular/core";
/**
 * 预约状态 枚举 -->文字 转换管道
 * @param status: number
 */

@Pipe({name: 'appointmentStatusPipe'})
export class AppointmentStatusPipe implements PipeTransform {
  transform(state: number): string {
    if (state == 0) {
      return "未接受";
    } else if (state == 1) {
      return "已接受";
    } else if (state == 2) {
      return "已取消";
    } else if (state == 3) {
      return "已完成";
    }
  }
}
