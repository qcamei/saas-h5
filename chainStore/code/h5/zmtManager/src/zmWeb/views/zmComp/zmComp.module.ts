///<reference path="form/ZmCheckbox.ts"/>
import { NgModule } from '@angular/core';
import {ZmBtnLarge} from "./btn/ZmBtnLarge";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {ZmPage} from "./pagination/ZmPage";
import {ZmInputPrice} from "./form/ZmInputPrice";
import {ZmInputPhone} from "./form/ZmInputPhone";
import {ZmInputNumber} from "./form/ZmInputNumber";
import {ZmInputTextarea} from "./form/ZmInputTextarea";
import {ZmInputPwd} from "./form/ZmInputPwd";
import {ZmSearchBox} from "./form/ZmSearchBox";
import {ZmInputFile} from "./form/ZmInputFile";
import {ZmBtnNew} from "./btn/ZmBtnNew";
import {ZmBtnMd} from "./btn/ZmBtnMd";
import {ZmBtnSmall} from "./btn/ZmBtnSmall";
import {ZmInputRadio} from "./form/ZmInputRadio";
import {ZmNoData} from "./form/ZmNoData";
import {ZmImgPreview} from "./form/ZmImgPreview";
import {SharedModule} from "../common/SharedModule/SharedModule";
import {ZmInputName} from "./form/ZmInputName";
import {ZmInputBtn} from "./form/ZmInputBtn";
import {ZmInputPwdConfirm} from "./form/ZmInputPwdConfirm";
import {ZmInputGender} from "./form/ZmInputGender";
import {ZmTable} from "./table/ZmTable";
import {ZmSelect} from "./form/ZmSelect";
import { ZmTableDetail } from './table/ZmTableDetail';
import {ZmImgCircle} from "./img/Zm_Img_Circle";
import {ZmRoleMenu} from "./other/ZmRoleMenu";
import {ZmListCheckbox} from "./form/ZmListCheckbox";
import {ZmInputText} from "./form/ZmInputText";
import { ZmInputTextGroup } from './form/ZmInputTextGroup';
import {SellectAllCheckbox} from "./form/ZmSelectAllCheckbox";
import {SelectListCheckbox} from "./form/ZmSelectListCheckbox";
import {ZmTabs} from "./tab/ZmTabs";
import { ZmSelectSmall } from './form/ZmSelectSmall';
import { ZmSearchDate } from './date/ZmSerchDate';
import {ZmSingleFile} from "./form/ZmSingleFile";
import {ZmSelectType} from "./form/ZmSelectType";
import {ZmInputTextareaMax} from "./form/ZmInputTextareaMax";
import {ZmInputCheckbox} from "./form/ZmInputCheckbox";
import {ZmCheckbox} from "./form/ZmCheckbox";


@NgModule({
  declarations: [
    //按钮组件
    ZmBtnNew,
    ZmBtnLarge,
    ZmBtnMd,
    ZmBtnSmall,

    //输入框组件
    ZmInputBtn,
    ZmInputName,
    ZmInputPhone,
    ZmInputGender,
    ZmInputNumber,
    ZmSearchBox,
    ZmInputPrice,
    ZmInputTextarea,
    ZmInputPwd,
    ZmInputPwdConfirm,
    ZmInputFile,
    ZmSingleFile,
    ZmInputRadio,
    ZmImgPreview,
    ZmListCheckbox,
    ZmInputText,
    ZmInputTextGroup,
    SellectAllCheckbox,
    SelectListCheckbox,
    ZmInputTextareaMax,
    ZmCheckbox,
    ZmInputCheckbox,
    // 日期
    ZmSearchDate,

    ZmSelect,
    ZmSelectType,
    ZmSelectSmall,
    ZmPage,
    ZmNoData,
    ZmTabs,
    ZmTable,
    ZmTableDetail,
    ZmImgCircle,
    ZmRoleMenu,


  ],
  imports: [
    NgbModule,
    CommonModule,
    FormsModule,
    SharedModule,
  ],
  providers: [
  ],
  exports:[
    //按钮组件
    ZmBtnNew,
    ZmBtnLarge,
    ZmBtnMd,
    ZmBtnSmall,

    //输入框组件
    ZmInputBtn,
    ZmInputName,
    ZmInputPhone,
    ZmInputGender,
    ZmInputNumber,
    ZmSearchBox,
    ZmInputPrice,
    ZmInputTextarea,
    ZmInputPwd,
    ZmInputPwdConfirm,
    ZmInputFile,
    ZmSingleFile,
    ZmInputRadio,
    ZmImgPreview,
    ZmListCheckbox,
    ZmInputText,
    ZmInputTextGroup,
    SellectAllCheckbox,
    SelectListCheckbox,
    ZmInputTextareaMax,
    ZmCheckbox,
    ZmInputCheckbox,
    // 日期
    ZmSearchDate,


    ZmSelect,
    ZmSelectType,
    ZmSelectSmall,
    ZmPage,
    ZmNoData,
    ZmTabs,
    ZmTable,
    ZmTableDetail,
    ZmImgCircle,
    ZmRoleMenu,


  ],
  entryComponents:[

  ]
})
export class ZmCompModule { }
