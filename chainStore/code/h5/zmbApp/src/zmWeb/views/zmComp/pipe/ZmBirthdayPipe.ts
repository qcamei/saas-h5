import { Pipe, PipeTransform } from '@angular/core';
import {AppUtils} from "../../../comModule/AppUtils";

@Pipe({ name: 'zmBirthday' })
export class ZmBirthdayPipe implements PipeTransform {
  transform(birthday: any): string {
    let pattern:string = "{0}-{1}-{2}"
    let target = null;
    if(!AppUtils.isNullObj(birthday)){
      target = AppUtils.format(pattern,birthday.year,birthday.month,birthday.day)
    }
    return target;
  }
}
