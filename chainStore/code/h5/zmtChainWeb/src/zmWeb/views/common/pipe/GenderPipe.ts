import {Pipe, PipeTransform} from "@angular/core";
import {GenderEnum} from "../../../comModule/enum/GenderEnum";

@Pipe({ name: 'genderPipe' })
export class GenderPipe implements PipeTransform {
  transform(gender: number): string {
    if(gender == GenderEnum.FEMALE){
      return "女";
    }else if(gender == GenderEnum.MALE){
      return "男";
    }else{
      return "-";
    }
  }
}
