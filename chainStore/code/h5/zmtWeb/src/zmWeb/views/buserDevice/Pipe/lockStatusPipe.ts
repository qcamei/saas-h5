import {Pipe, PipeTransform} from "@angular/core";
import {MClientLockStateEnum} from "../../../bsModule/buserDevice/data/MClientLockStateEnum";


/**
 * 仪器锁定状态枚举-->文字 转换管道
 */

@Pipe({name: 'lockStatePipe'})
export class LockStatePipe implements PipeTransform {
  transform(status: number): string {
    if (status == MClientLockStateEnum.unLocked) {
      return "未锁定";
    } else if (status == MClientLockStateEnum.Locked) {
      return "已锁定";
    }else if (status == MClientLockStateEnum.LockedBySupplier) {
      return "被厂家锁定";
    }
  }
}

