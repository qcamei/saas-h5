import {Pipe, PipeTransform} from "@angular/core";
import {MClientStatusEnum} from "../../../bsModule/buserDevice/data/MClientStatusEnum";


/**
 * 仪器联网状态枚举-->文字 转换管道
 */

@Pipe({name: 'netStatePipe'})
export class NetStatePipe implements PipeTransform {
  transform(status: number): string {
    if (status == MClientStatusEnum.Online) {
      return "在线";
    } else if (status == MClientStatusEnum.Offline) {
      return "离线";
    }
  }
}

