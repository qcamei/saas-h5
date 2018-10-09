import {Pipe, PipeTransform} from "@angular/core";
import {MClientCtrlStateEnum} from "../../../bsModule/buserDevice/data/MClientCtrlStateEnum";


/**
 * 仪器联网状态枚举-->文字 转换管道
 */

@Pipe({name: 'deviceStatePipe'})
export class DeviceStatePipe implements PipeTransform {
  transform(ctrlState:number): string {
    let result = "";
    if(ctrlState == MClientCtrlStateEnum.Poweroff){
      result = "关机";
    }else if(ctrlState == MClientCtrlStateEnum.Poweron){
      result = "开机";
    }else if(ctrlState == MClientCtrlStateEnum.Standby){
      result = "待机中";
    }else if(ctrlState == MClientCtrlStateEnum.Readying){
      result = "准备中";
    }else if(ctrlState == MClientCtrlStateEnum.Working){
      result = "工作中";
    }
    return result;
  }
}

