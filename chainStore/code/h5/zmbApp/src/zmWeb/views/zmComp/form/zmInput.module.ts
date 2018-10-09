import { NgModule } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {IonicModule} from "ionic-angular";
import {ZmSearchBox} from "./ZmSearchBox";
import {ZmSubmitBtn} from "./ZmSubmitBtn";
import {ZmListCheckbox} from "./checkbox/ZmListCheckbox";
import {ZmVCode} from "./vcode/ZmVCode";
import {ZmDatePicker} from "./date/ZmDatePicker";
import {ZmTimePicker} from "./date/ZmTimePicker";
import {ZmInputDropdown} from "./dropDown/ZmInputDropdown";
import {ZmInputFile} from "./file/ZmInputFile";
import {ZmImgUpload} from "./img/ZmImgUpload";
import {ZmImgPreview} from "./img/ZmImgPreview";
import {ZmPipeModule} from "../pipe/zmPipe.module";
import {ZmInputName} from "./text/ZmInputName";
import {ZmInputGender} from "./radio/ZmInputGender";
import {ZmInputNumber} from "./text/ZmInputNumber";
import {ZmInputPhone} from "./text/ZmInputPhone";
import {ZmInputPrice} from "./text/ZmInputPrice";
import {ZmInputPwd} from "./text/ZmInputPwd";
import {ZmInputPwdConfirm} from "./text/ZmInputPwdConfirm";
import {ZmInputText} from "./text/ZmInputText";
import {ZmInputTextarea} from "./text/ZmInputTextarea";
import {ZmInputRadio} from "./radio/ZmInputRadio";
import {ZmInputRightRadio} from "./inputRight/ZmInputRightRadio";
import {ZmInputRightPrice} from "./inputRight/ZmInputRightPrice";
import {ZmInputRightText} from "./inputRight/ZmInputRightText";
import {ZmInputRightGender} from "./inputRight/ZmInputRightGender";
import {ZmInputRightTextarea} from "./inputRight/ZmInputRightTextarea";
import {MultiPickerModule} from "ion-multi-picker";
import {CityPicker} from "./multiPicker/MultiPicker";
import { ZmImgRadio } from './radio/ZmImgRadio';
import {FlexLayoutModule} from "@angular/flex-layout";
import {DatePicker} from "./date/timeSlot/DatePicker";
import {ZmSelectTimePeriod} from "./date/ZmSelectTimePeriod";
import {ZmBigImgPreview} from "./img/ZmBigImgPreview";
import {ZmbSelect} from "./select/ZmbSelect";
import {ZmDateTimePicker} from "./date/ZmDateTimePicker";
import {ZmDateYears} from "./date/ZmDateYears";

@NgModule({
  declarations: [

    ZmInputGender,
    ZmInputRadio,
    ZmSearchBox,
    ZmSubmitBtn,
    ZmListCheckbox,
    ZmVCode,
    ZmImgRadio,

    DatePicker,
    ZmDatePicker,
    ZmTimePicker,
    ZmDateTimePicker,
    ZmDateYears,
    ZmSelectTimePeriod,
    ZmbSelect,

    ZmInputDropdown,
    ZmInputFile,
    ZmImgUpload,
    ZmImgPreview,
    ZmBigImgPreview,
    CityPicker,

    //text
    ZmInputName,
    ZmInputNumber,
    ZmInputPhone,
    ZmInputPrice,
    ZmInputPwd,
    ZmInputPwdConfirm,
    ZmInputText,
    ZmInputTextarea,

    //inputRight
    ZmInputRightText,
    ZmInputRightPrice,
    ZmInputRightRadio,
    ZmInputRightGender,
    ZmInputRightTextarea,

  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ZmPipeModule,
    MultiPickerModule,
    FlexLayoutModule
  ],
  providers: [],
  exports:[
    ZmInputGender,
    ZmInputRadio,
    ZmSearchBox,
    ZmSubmitBtn,
    ZmListCheckbox,
    ZmVCode,
    ZmImgRadio,

    DatePicker,
    ZmDatePicker,
    ZmTimePicker,
    ZmDateTimePicker,
    ZmDateYears,
    ZmSelectTimePeriod,
    ZmbSelect,

    ZmInputDropdown,
    ZmInputFile,
    ZmImgUpload,
    ZmImgPreview,
    ZmBigImgPreview,
    CityPicker,

    //text
    ZmInputName,
    ZmInputNumber,
    ZmInputPhone,
    ZmInputPrice,
    ZmInputPwd,
    ZmInputPwdConfirm,
    ZmInputText,
    ZmInputTextarea,

    //inputRight
    ZmInputRightText,
    ZmInputRightPrice,
    ZmInputRightRadio,
    ZmInputRightGender,
    ZmInputRightTextarea,

  ]
})
export class ZmInputModule {

  constructor(){
  }

}
