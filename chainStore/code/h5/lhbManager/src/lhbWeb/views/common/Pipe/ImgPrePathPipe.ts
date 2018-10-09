import {SessionUtil} from "../../../comModule/SessionUtil";
import { Pipe, PipeTransform } from '@angular/core';




@Pipe({ name: 'imgPrePath' })
export class ImgPrePathPipe implements PipeTransform {
  transform(img: string): string {
    return SessionUtil.getInstance().getImgPreUrl()+img;
  }
}
