import { Pipe, PipeTransform } from '@angular/core';
import {AppCfg} from "../../../comModule/AppCfg";

@Pipe({ name: 'zmImgPath' })
export class ZmImgPathPipe implements PipeTransform {
  transform(img: string): string {
    if(!img){
      return img;
    }
    return AppCfg.getInstance().getImgPreUrl()+img;
  }
}
