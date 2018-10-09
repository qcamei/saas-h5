import { NgModule } from '@angular/core';
import {ZmBtnLarge} from "./btn/ZmBtnLarge";
import {ZmInputText} from "./form/ZmInputText";
import {FormsModule} from "@angular/forms";
import {ZmBtnDropdown} from "./btn/ZmBtnDropdown";
import {CommonModule} from "@angular/common";
import {ZmTabs} from "./tab/ZmTabs";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {ZmModal} from "./modal/ZmModal";
import {ZmPage} from "./pagination/ZmPage";
import {ZmCollapse} from "./collapse/ZmCollapse";
import {ZmInputDiscount} from "./form/ZmInputDiscount";
import {ZmInputPrice} from "./form/ZmInputPrice";
import {ZmInputPhone} from "./form/ZmInputPhone";
import {ZmInputNumber} from "./form/ZmInputNumber";
import {ZmButton} from "./form/ZmButton";
import {ZmInputTextarea} from "./form/ZmInputTextarea";
import {ZmInputPassword} from "./form/ZmInputPassword";
import {ZmLoginPhone} from "./form/ZmLoginPhone";
import {ZmVCode} from "./form/ZmVCode";
import {ZmSearchBox} from "./form/ZmSearchBox";
import {ZmInputFile} from "./form/ZmInputFile";
import {ZmBtnDate} from "./btn/ZmBtnDate";
import {ZmBtnNew} from "./btn/ZmBtnNew";
import {ZmBtnSearch} from "./btn/ZmBtnSearch";
import {ZmBtnSmall} from "./btn/ZmBtnSmall";
import {ZmInputRadio} from "./form/ZmInputRadio";
import {ZmTable} from "./table/Zm_Table";
import {ZmInputCheckbox} from "./form/ZmInputCheckbox";
import {ZmDate} from "./date/ZmDate";
import {ZmTime} from "./date/ZmTime";



@NgModule({
  declarations: [
    //按钮组件
    ZmButton,
    ZmBtnDate,
    ZmBtnNew,
    ZmBtnLarge,
    ZmBtnSearch,
    ZmBtnSmall,
    ZmBtnDropdown,

    //输入框组件
    ZmInputText,
    ZmInputPhone,
    ZmLoginPhone,
	  ZmInputNumber,
    ZmInputCheckbox,
    ZmSearchBox,
    ZmVCode,

    ZmInputDiscount,
    ZmInputPrice,
    ZmInputTextarea,
    ZmInputPassword,
    ZmInputFile,
    ZmInputRadio,

    //控件
    ZmTabs,
    ZmModal,
    ZmPage,
    ZmCollapse,
    ZmTable,
    ZmDate,
    ZmTime,
  ],
  imports: [
    FormsModule,
    CommonModule,
    NgbModule
  ],
  providers: [],
  exports:[
    //按钮组件
    ZmButton,
    ZmBtnDate,
    ZmBtnNew,
    ZmBtnLarge,
    ZmBtnSearch,
    ZmBtnSmall,
    ZmBtnDropdown,

    //输入框组件
    ZmInputText,
    ZmInputPhone,
    ZmLoginPhone,
    ZmInputNumber,
    ZmInputCheckbox,
    ZmSearchBox,
    ZmVCode,

    ZmInputDiscount,
    ZmInputPrice,
    ZmInputTextarea,
    ZmInputPassword,
    ZmInputFile,
    ZmInputRadio,

    //控件
    ZmTabs,
    ZmModal,
    ZmPage,
    ZmCollapse,
    ZmTable,
    ZmDate,
    ZmTime,
  ]
})
export class ZmCompModule { }
