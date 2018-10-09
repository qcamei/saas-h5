import {Pipe, PipeTransform} from "@angular/core";
import {BUserCheckStatusEnum} from "../../../bsModule/buserCheck/apiData/BUserCheckStatusEnum";


/**
 * 仪器联网状态枚举-->文字 转换管道
 */

@Pipe({name: 'checkStatusPipe'})
export class CheckStatusPipe implements PipeTransform {
  transform(status:number): string {
    let result = "";
    if(status == BUserCheckStatusEnum.NOTSUBMITCHECK){
      result = "未提交审核";
    }else if(status == BUserCheckStatusEnum.PASSCHECK){
      result = "审核通过";
    }else if(status == BUserCheckStatusEnum.NOTPASSCHECK){
      result = "审核未通过";
    }else if(status == BUserCheckStatusEnum.CHECKING){
      result = "审核中";
    }
    return result;
  }
}

