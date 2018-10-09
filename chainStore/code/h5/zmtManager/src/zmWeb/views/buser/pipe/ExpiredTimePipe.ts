import {Pipe, PipeTransform} from "@angular/core";
import {DatePipe} from "@angular/common";
import {BuserRoleEnum} from "../../../bsModule/buser/apiData/BuserRoleEnum";

@Pipe({name:"expiredTimePipe"})
export class ExpiredTimePipe implements PipeTransform{
  constructor(private datePipe:DatePipe){}

  transform(date:any, roleSet: Array<number>) {
    if (roleSet == null
      ||roleSet[0] == null || roleSet[0] == BuserRoleEnum.CLERK || roleSet[0] == BuserRoleEnum.INIT
      || date == null || date == 0){
      return '-';
    } else if (roleSet[0] == BuserRoleEnum.BOSS) {
      return this.datePipe.transform(date,'yyyy-MM-dd');
    }
  }
}
