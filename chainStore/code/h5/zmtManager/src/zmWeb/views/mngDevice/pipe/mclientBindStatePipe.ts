import {Pipe, PipeTransform} from '@angular/core';
import {MClientIsActivatedEnum} from "../../../bsModule/mngDevice/data/mclient/MClientIsActivatedEnum";

@Pipe({name: 'mclientBindStatePipe'})
export class MClientBindStatePipe implements PipeTransform {
  transform(status: number): string {
    if (status == MClientIsActivatedEnum.True) {
      return '已绑定';
    } else if (status == MClientIsActivatedEnum.False) {
      return '可绑定';
    }
  }
}
