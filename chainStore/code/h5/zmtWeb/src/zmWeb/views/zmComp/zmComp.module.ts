import { NgModule } from '@angular/core';
import {ZmBtnLarge} from "./btn/ZmBtnLarge";
import {ZmInputText} from "./form/ZmInputText";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {ZmTabs} from "./tab/ZmTabs";

import {ZmPage} from "./pagination/ZmPage";
import {ZmInputPrice} from "./form/ZmInputPrice";
import {ZmInputPhone} from "./form/ZmInputPhone";
import {ZmInputTextarea} from "./form/ZmInputTextarea";
import {ZmInputPwd} from "./form/ZmInputPwd";
import {ZmVCode} from "./form/ZmVCode";
import {ZmSearchBox} from "./form/ZmSearchBox";
import {ZmInputFile} from "./form/ZmInputFile";
import {ZmBtnDate} from "./btn/ZmBtnDate";
import {ZmBtnNew} from "./btn/ZmBtnNew";
import {ZmBtnMd} from "./btn/ZmBtnMd";
import {ZmBtnSmall} from "./btn/ZmBtnSmall";
import {ZmInputRadio} from "./form/ZmInputRadio";
import {ZmInputCheckbox} from "./form/ZmInputCheckbox";
import {ZmDate} from "./date/ZmDate";
import {ZmTime} from "./date/ZmTime";
import {ZmListCheckbox} from "./form/ZmListCheckbox";
import {ZmPayTypeComp} from "./form/ZmPayTypeComp";
import {zmValidPeriodRadio} from "./form/zmValidPeriodRadio";
import { ZmSearchDate} from "./date/ZmSearchDate";
import {ZmNoData} from "./form/ZmNoData";
import {ZmImgPreview} from "./form/ZmImgPreview";
import {SharedModule} from "../common/SharedModule/SharedModule";
import {ZmInputName} from "./form/ZmInputName";
import {ZmInputPwdConfirm} from "./form/ZmInputPwdConfirm";
import {ZmTable} from "./table/ZmTable";
import {ZmTableSelectSingle} from "./table/ZmTableSelectSingle";
import {ZmSelect} from "./form/ZmSelect";
import { NotRepeatSubmitDirective} from "./directive/NotRepeatSubmitDirective";
import {SecondDisapperDirective} from "./directive/SecondDiaspperDirective";
import {BlinkSecondDirective} from "./directive/BlinkSecondDirective";
import {BigImgDirective} from "./directive/BigImgDirective";
import {AddProductPopup} from "./functionsComp/addProductPopup/AddProductPopup";
import {AddGoodsPopup} from "./functionsComp/addGoodPopup/AddGoodsPopup";
import {AddPackagePopup} from "./functionsComp/addPackagePopup/AddPackagePopup";
import {GoodsDetailModalComponent} from "./functionsComp/goodsDetailComp/GoodsDetailModal.Component";
import {PackageDetailModalComponent} from "./functionsComp/packageDetailComp/PackageDetailModalComponent";
import {ProductInfoDetailModalComponent} from "./functionsComp/productDetailComp/ProductInfoDetailModal.Component";
import {ZmCheckbox} from "./form/ZmCheckbox";
import {ZmImgRecord} from "./form/ZmImgRecord";
import {AnimationModalDirective} from "./directive/AnimationModalDirective";
import {ZmPayPriceComp} from "./form/zmPay/ZmPayPrice";
import {ZmPayType} from "./form/zmPay/ZmPayType";
import { ZmTableDetail } from './table/ZmTableDetail';
import {PieChartsElement} from "./eCharts/pieCharte/PieChartsElement";
import {LineEChartsElement} from "./eCharts/lineEcharts/LineEChartsElement"
import { NgxEchartsModule } from 'ngx-echarts';
import { PieAngleEChartsElement } from './eCharts/pieAngleCharte/pieAngleCharte';
import {ZZLECharts} from './eCharts/ZZLECharts/ZZLECharts';
import {ZmFuseCompModule} from "../../../zmFuse/zmFuseComp.module";
import { ZmInputFileLCE } from './form/ZmInputFileLCE';
import {ZmMatTable} from "./table/ZmMatTable";
import {ZmCard} from "./card/ZmCard";
import {ZmMatTableCheckbox} from "./table/ZmMatTableCheckbox";
import {ZmMatTabs} from "./tab/ZmMatTabs";
import {ZmSelectValues} from "./form/ZmSelectValues";
import {ZmLabels} from "./form/ZmLabels";
import {ZmLabelsRO} from "./form/ZmLabelsRO";
import {ZmInputPCode} from "./form/ZmInputPCode";
import {SwitchButton} from "../common/SwitchButton/SwitchButton";
import {ZmInputPeriod} from "./form/ZmInputPeriod";
import {ZmInputWFDiscount} from "./form/ZmInputWFDiscount";
import {ZmInputTel} from "./form/ZmInputTel";
import {ZmInputDiscout} from "./form/ZmInputDiscout";
import {ZmNoDataSmall} from "./form/ZmNoDateSmall";
import {ZmCardBox} from "./card/ZmCardBox";
import {ZmBtnTab} from "./btn/ZmBtnTab";
import {ZmImgCircle} from "./img/ZmImgCircle";
import {ZmInputFloat} from "./form/ZmInputFloat";
import { ZmBtn } from './btn/ZmBtn';
import {ZmDropDownMenu} from "./menu/ZmDropDownMenu";
import {MatFormFieldModule, MatMenuModule} from "@angular/material";
import {CitySelect} from "./form/citySelect/citySelect";
import {ZmImgCropper} from "./img/ZmImgCropper";
import {ImageCropperModule} from "ngx-image-cropper";
import { ZmTabSlider } from './tab/ZmTabSlider';
import {ZmSelectString} from "./form/ZmSelectString";
import {ZmSelectNumber} from "./form/ZmSelectNumber";
import {ZmTimeSlot} from "./date/timeSlot/ZmTimeSlot";
import { ZmBtnUpDown } from './btn/ZmBtnUpDown';


@NgModule({
  declarations: [
    //按钮组件
    ZmBtnDate,
    ZmBtnNew,
    ZmBtnLarge,
    ZmBtnMd,
    ZmBtn,
    ZmBtnSmall,
    ZmBtnTab,
    ZmBtnUpDown,
    // slider
    ZmTabSlider,

    //输入框组件
    ZmInputText,
    ZmInputPCode,
    ZmInputName,
    ZmInputPhone,
    ZmInputTel,
    ZmInputCheckbox,
    ZmCheckbox,
    ZmSearchBox,
    ZmVCode,
    ZmInputPrice,
    ZmInputWFDiscount,
    ZmInputDiscout,
    ZmInputTextarea,
    ZmInputPwd,
    ZmInputPwdConfirm,
    CitySelect,

    ZmInputFile,
    ZmInputFileLCE,
    ZmInputRadio,
    zmValidPeriodRadio,

    ZmListCheckbox,
    ZmPayTypeComp,
    ZmImgPreview,
    ZmImgRecord,
    ZmPayPriceComp,
    ZmPayType,

    ZmSelect,
    ZmSelectValues,
    ZmSelectString,
    ZmSelectNumber,

    //图表控件
    PieChartsElement,
    LineEChartsElement,
    PieAngleEChartsElement,
    ZZLECharts,

    //控件
    ZmTabs,
    ZmMatTabs,
    ZmPage,
    ZmDate,
    ZmTimeSlot,
    ZmSearchDate,
    ZmTime,
    ZmNoData,
    ZmNoDataSmall,

    //table
    ZmTable,
    ZmTableDetail,
    ZmTableSelectSingle,
    //menu
    ZmDropDownMenu,

    //图片预览
    ZmImgCircle,
    ZmImgCropper,


    //指令
    NotRepeatSubmitDirective,
    SecondDisapperDirective,
    BlinkSecondDirective,
    BigImgDirective,
    AnimationModalDirective,

    AddProductPopup,
    AddGoodsPopup,
    AddPackagePopup,
    GoodsDetailModalComponent,
    ProductInfoDetailModalComponent,
    PackageDetailModalComponent,
    ZmMatTable,
    ZmMatTableCheckbox,
    ZmCard,
    ZmCardBox,
    ZmLabels,
    ZmLabelsRO,
    SwitchButton,
    ZmInputPeriod,
    ZmInputFloat,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    SharedModule,
    NgxEchartsModule,
    MatMenuModule,
    MatFormFieldModule,
    ZmFuseCompModule,
    ImageCropperModule,
  ],
  providers: [
  ],
  exports:[
    ZmFuseCompModule,

    //按钮组件
    ZmBtnDate,
    ZmBtnNew,
    ZmBtnLarge,
    ZmBtnMd,
    ZmBtn,
    ZmBtnSmall,
    ZmBtnTab,
    ZmBtnUpDown,
    // slider
    ZmTabSlider,

    //输入框组件
    ZmInputText,
    ZmInputPCode,
    ZmInputName,
    ZmInputPhone,
    ZmInputTel,
    ZmInputCheckbox,
    ZmCheckbox,
    ZmSearchBox,
    ZmVCode,
    ZmInputPrice,
    ZmInputWFDiscount,
    ZmInputDiscout,
    ZmInputTextarea,
    ZmInputPwd,
    ZmInputPwdConfirm,
    CitySelect,

    ZmInputFile,
    ZmInputFileLCE,
    ZmInputRadio,
    zmValidPeriodRadio,

    ZmListCheckbox,
    ZmPayTypeComp,
    ZmImgPreview,
    ZmImgRecord,
    ZmPayPriceComp,
    ZmPayType,

    ZmSelect,
    ZmSelectValues,
    ZmSelectString,
    ZmSelectNumber,

    //图表控件
    PieChartsElement,
    LineEChartsElement,
    PieAngleEChartsElement,
    ZZLECharts,

    //控件
    ZmTabs,
    ZmMatTabs,
    ZmPage,
    ZmDate,
    ZmTimeSlot,
    ZmSearchDate,
    ZmTime,
    ZmNoData,
    ZmNoDataSmall,

    //table
    ZmTable,
    ZmTableDetail,
    ZmTableSelectSingle,
    //menu
    ZmDropDownMenu,

    //图片预览
    ZmImgCircle,
    ZmImgCropper,

    NotRepeatSubmitDirective,
    SecondDisapperDirective,
    BlinkSecondDirective,
	  BigImgDirective,
    BlinkSecondDirective,
    AnimationModalDirective,
    ZmMatTable,
    ZmMatTableCheckbox,
    ZmCard,
    ZmCardBox,
    ZmLabels,
    ZmLabelsRO,
    SwitchButton,
    ZmInputPeriod,
    ZmInputFloat,

  ],
  entryComponents:[
    AddProductPopup,
    AddGoodsPopup,
    AddPackagePopup,
    GoodsDetailModalComponent,
    ProductInfoDetailModalComponent,
    PackageDetailModalComponent,
  ]
})
export class ZmCompModule { }
