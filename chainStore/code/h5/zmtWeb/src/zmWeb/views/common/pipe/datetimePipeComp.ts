import {Pipe, PipeTransform} from "@angular/core";
import {DatePipe} from "@angular/common";

@Pipe({name:"datetimePipeComp"})
export class DatetimePipeComp implements PipeTransform{
  constructor(private datePipe:DatePipe){}

  transform(date:any,hasMbCard:boolean) {
    if(!hasMbCard)
      return "-";
    else if(hasMbCard && date =='0')
      return "永久";
    return this.datePipe.transform(date,'yyyy/MM/dd');
  }
}
