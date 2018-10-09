import { NgModule } from '@angular/core';
import {ZmImgPathPipe} from "./ZmImgPathPipe";
import {ZmGenderPipe} from "./ZmGenderPipe";
import {ZmBirthdayPipe} from "./ZmBirthdayPipe";
import {ZmDatePipe} from "./ZmDatePipe";
import {ZmDiscountPipe} from "./ZmDiscountPipe";
import {ZmCardStatePipe} from "./ZmCardStatePipe";
import {ZmOrderStatusPipe} from "./ZmOrderStatusPipe";
import {ZmOrderTrackStatusPipe} from "./ZmOrderTrackStatusPipe";
import {ZmOrderTrackTypePipe} from "./ZmOrderTrackTypePipe";
import {ZmOrderOriginPipe} from "./ZmOrderOriginPipe";


@NgModule({
  declarations: [
    //pipe
    ZmImgPathPipe,
    ZmGenderPipe,
    ZmBirthdayPipe,
    ZmDatePipe,
    ZmDiscountPipe,
    ZmCardStatePipe,
    ZmOrderStatusPipe,
    ZmOrderTrackStatusPipe,
    ZmOrderTrackTypePipe,
    ZmOrderOriginPipe,

  ],
  imports: [
  ],
  providers: [],
  exports:[
    ZmImgPathPipe,
    ZmGenderPipe,
    ZmBirthdayPipe,
    ZmDatePipe,
    ZmDiscountPipe,
    ZmCardStatePipe,
    ZmOrderStatusPipe,
    ZmOrderTrackStatusPipe,
    ZmOrderTrackTypePipe,
    ZmOrderOriginPipe,
  ]
})
export class ZmPipeModule {

  constructor(){
  }

}
