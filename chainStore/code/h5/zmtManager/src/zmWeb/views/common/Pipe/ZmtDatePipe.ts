import {Pipe, PipeTransform} from "@angular/core";
import {DatePipe} from "@angular/common";

@Pipe({name:"zmtDatePipe"})
export class ZmtDatePipe implements PipeTransform{
  constructor(private datePipe:DatePipe){}

  transform(date:any) {
    if(date == null){
      return "-";
    }else{
      return this.datePipe.transform(date,'yyyy-MM-dd');
    }
  }
}
