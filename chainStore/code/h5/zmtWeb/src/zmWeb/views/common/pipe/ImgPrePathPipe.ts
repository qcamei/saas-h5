import { Pipe, PipeTransform } from '@angular/core';
import {AppCfg} from "../../../comModule/AppCfg";
import {AppUtils} from "../../../comModule/AppUtils";




@Pipe({ name: 'imgPrePath' })
export class ImgPrePathPipe implements PipeTransform {
  transform(img:string): string {
    if(!AppUtils.isNullOrWhiteSpace(img)){
      return AppCfg.getInstance().getImgPreUrl()+img;
    }
  }
}
