import { Pipe, PipeTransform } from '@angular/core';
import {AppUtils} from "../../../comModule/AppUtils";
import {Constants} from "../../zmComUtils/Constants";

@Pipe({
  name: 'zmDatePipe'
})
export class ZmDatePipe implements PipeTransform {

  //只支持时间戳
  transform(value:string,formatP?:string):string {
    if(value && value>"0"){
      let date= new Date(parseInt(value));
      let fmt = Constants.DATE_FORMAT;
      if(formatP){
        fmt = formatP
      }
      return AppUtils.formatDate(date,fmt);
    }else{
      return "-";
    }

  }
}
