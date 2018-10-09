import {Pipe, PipeTransform} from '@angular/core';
import {MClientStatusEnum} from "../../../bsModule/mngDevice/data/mclient/MClientStatusEnum";

@Pipe({name: 'mclientStatusPipe'})
export class MClientStautsPipe implements PipeTransform {
  transform(status: number): string {
    if (status == MClientStatusEnum.Offline) {
      return '离线';
    } else if (status == MClientStatusEnum.Online) {
      return '在线';
    }
  }
}
