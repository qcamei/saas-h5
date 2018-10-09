import { Pipe, PipeTransform } from '@angular/core';
import {AppUtils} from "../../../comModule/AppUtils";
import {Constants} from "../Util/Constants";

@Pipe({
  name: 'times'
})
export class TimesPipe implements PipeTransform {

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
