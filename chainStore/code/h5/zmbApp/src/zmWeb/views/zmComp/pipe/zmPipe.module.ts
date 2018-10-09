import { NgModule } from '@angular/core';
import {ZmImgPathPipe} from "./ZmImgPathPipe";
import {ZmGenderPipe} from "./ZmGenderPipe";
import {ZmBirthdayPipe} from "./ZmBirthdayPipe";
import {ZmDatePipe} from "./ZmDatePipe";
import {ZmDiscountPipe} from "./ZmDiscountPipe";
import {ZmCardStatePipe} from "./ZmCardStatePipe";
import {ZmOrderStatusPipe} from "./ZmOrderStatusPipe";
import {ZmTimesPipe} from "./ZmTimes.pipe";


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
    ZmTimesPipe,

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
    ZmTimesPipe,
  ]
})
export class ZmPipeModule {

  constructor(){
  }

}
