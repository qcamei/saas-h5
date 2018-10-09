import {Pipe, PipeTransform} from "@angular/core";
import {StateEnum} from "../../../comModule/enum/StateEnum";

@Pipe({name: 'statePipe'})
export class StatePipe implements PipeTransform {
  transform(state:string): string {
    if(typeof (state)=="string"){
      if (parseInt(state) === StateEnum.Open) {
        return "上架";
      } else if (parseInt(state) === StateEnum.Close) {
        return "下架";
      }
    }else if(typeof (state)=="number"){
      if (state === StateEnum.Open) {
        return "上架";
      } else if (state === StateEnum.Close) {
        return "下架";
      }
    }
  }
}

@Pipe({name: 'statePipe2'})
export class StatePipe2 implements PipeTransform {
  transform(state: string): string {
    if(typeof (state)=="string"){
      if (parseInt(state) === StateEnum.Open) {
        return "下架";
      } else if (parseInt(state) === StateEnum.Close) {
        return "上架";
      }
    }else if(typeof (state)=="number"){
      if (state === StateEnum.Open) {
        return "下架";
      } else if (state === StateEnum.Close) {
        return "上架";
      }
    }
  }
}
