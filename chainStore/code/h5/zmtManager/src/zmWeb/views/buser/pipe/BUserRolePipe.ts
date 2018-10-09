import {Pipe, PipeTransform} from '@angular/core';
import {BuserRoleEnum} from "../../../bsModule/buser/apiData/BuserRoleEnum";

@Pipe({name: 'buserRolePipe'})
export class BUserRolePipe implements PipeTransform {
  transform(roleSet: Array<number>): string {
    if(roleSet == null || roleSet[0] == null){
      return '-';
    } else if (roleSet[0] == BuserRoleEnum.BOSS) {
        return '管理者';
    } else if (roleSet[0] == BuserRoleEnum.CLERK) {
      return '工作者';
    } else if (roleSet[0] == BuserRoleEnum.INIT) {
      return '未分配';
    }
  }
}
