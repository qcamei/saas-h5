import {Pipe, PipeTransform} from "@angular/core";
import {DatePipe} from "@angular/common";

@Pipe({name:"datetimePipe"})
export class DatetimePipe implements PipeTransform{
  constructor(private datePipe:DatePipe){}

  transform(date:any) {
    if(date==null || date==0 || date=='0'){
      return '-';
    }else{
      return this.datePipe.transform(date,'yyyy-MM-dd HH:mm:ss');
    }
  }
}
