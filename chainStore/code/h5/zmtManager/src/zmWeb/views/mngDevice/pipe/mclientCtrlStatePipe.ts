import {Pipe, PipeTransform} from '@angular/core';
import {MClientCtrlStateEnum} from "../../../bsModule/mngDevice/data/mclient/MClientCtrlStateEnum";
import {AppUtils} from "../../../comModule/AppUtils";

@Pipe({name: 'mclientCtrlStatePipe'})
export class MClientCtrlStatePipe implements PipeTransform {
  transform(status: number): string {
    status = parseInt(status+"");
    let content = '';
    switch(status){
      case MClientCtrlStateEnum.Poweroff:
        content= "已关机";
        break;
      case MClientCtrlStateEnum.Poweron:
        content="已开机";
        break;
      case MClientCtrlStateEnum.RequestingData:
        content="请求数据中";
        break;
      case MClientCtrlStateEnum.Standby:
        content="待机中";
        break;
      case MClientCtrlStateEnum.Readying:
        content="准备中";
        break;
      case MClientCtrlStateEnum.Working:
        content="工作中";
        break;
      case MClientCtrlStateEnum.Locked:
        content="已锁定";
        break;
      case MClientCtrlStateEnum.LockedBySupplier:
        content="被厂家锁定";
        break;
    }
    return content;
  }
}
