import {Pipe, PipeTransform} from '@angular/core';
import {AppUtils} from "../../../comModule/AppUtils";
import {MClientLockStateEnum} from "../../../bsModule/mngDevice/data/mclient/MClientLockStateEnum";

@Pipe({name: 'mclientLockStatePipe'})
export class MClientLockStatePipe implements PipeTransform {
  transform(status: number): string {
    status = parseInt(status+"");
    let content = '';
    switch(status){
      case MClientLockStateEnum.unLocked:
        content= "未锁定";
        break;
      case MClientLockStateEnum.Locked:
        content="已锁定";
        break;
      case MClientLockStateEnum.LockedBySupplier:
        content="被厂家锁定";
        break;
    }
    return content;
  }
}
