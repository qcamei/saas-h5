import {Pipe, PipeTransform} from "@angular/core";
import {DatePipe} from "@angular/common";
import {BuserRoleEnum} from "../../../bsModule/buser/apiData/BuserRoleEnum";

@Pipe({name:"expiredStatePipe"})
export class ExpiredStatePipe implements PipeTransform{
  constructor(private datePipe:DatePipe){}

  transform(date:any, roleSet: Array<number>) {
    if (roleSet == null
      ||roleSet[0] == null || roleSet[0] == BuserRoleEnum.CLERK || roleSet[0] == BuserRoleEnum.INIT
      || date == null){
      return '-';
    } else if (roleSet[0] == BuserRoleEnum.BOSS) {
      let curTime = new Date().getTime();
      if(date > curTime){
        return '正常';
      }else{
        return '过期';
      }
    }
  }
}
