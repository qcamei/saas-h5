import {NgModule} from '@angular/core';
import {ZmBtnLarge} from "./btn/ZmBtnLarge";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {ZmPage} from "./pagination/ZmPage";
import {ZmInputPrice} from "./form/ZmInputPrice";
import {ZmInputTextarea} from "./form/ZmInputTextarea";
import {ZmSearchBox} from "./form/ZmSearchBox";
import {ZmInputFile} from "./form/ZmInputFile";
import {ZmBtnNew} from "./btn/ZmBtnNew";
import {ZmBtnMd} from "./btn/ZmBtnMd";
import {ZmBtnSmall} from "./btn/ZmBtnSmall";
import {ZmInputRadio} from "./form/ZmInputRadio";
import {ZmListCheckbox} from "./form/ZmListCheckbox";
import {ZmNoData} from "./form/ZmNoData";
import {ZmImgPreview} from "./form/ZmImgPreview";
import {SharedModule} from "../common/SharedModule/SharedModule";
import {ZmInputName} from "./form/ZmInputName";
import {ZmSelect} from "./form/ZmSelect";
import {NotRepeatSubmitDirective} from "./directive/NotRepeatSubmitDirective";
import {SecondDisapperDirective} from "./directive/SecondDiaspperDirective";
import {BlinkSecondDirective} from "./directive/BlinkSecondDirective";
import {BigImgDirective} from "./directive/BigImgDirective";
import {AddProductPopup} from "./functionsComp/addProductPopup/AddProductPopup";
import {AddGoodsPopup} from "./functionsComp/addGoodPopup/AddGoodsPopup";
import {AddPackagePopup} from "./functionsComp/addPackagePopup/AddPackagePopup";
import {GoodsDetailModalComponent} from "./functionsComp/goodsDetailComp/GoodsDetailModal.Component";
import {PackageDetailModalComponent} from "./functionsComp/packageDetailComp/PackageDetailModalComponent";
import {ProductInfoDetailModalComponent} from "./functionsComp/productDetailComp/ProductInfoDetailModal.Component";
import {AnimationModalDirective} from "./directive/AnimationModalDirective";
import {ZmTableDetail} from './table/ZmTableDetail';
import {ZmFuseCompModule} from "../../../zmFuse/zmFuseComp.module";
import {ZmMatTable} from "./table/ZmMatTable";
import {ZmMatTableCheckbox} from "./table/ZmMatTableCheckbox";
import {ZmMatTabs} from "./tab/ZmMatTabs";
import {SwitchButton} from "../common/SwitchButton/SwitchButton";
import {ZmInputDiscount} from "./form/ZmInputDiscount";
import {ZmInputTel} from "./form/ZmInputTel";
import {ZmInputPCode} from "./form/ZmInputPCode";
import {ZmInputPeriod} from "./form/ZmInputPeriod";
import {ZmStorePreview} from "./form/ZmStorePreview";
import {ZmInputText} from "./form/ZmInputText";
import {ZmTableSelectSingle} from "./table/ZmTableSelectSingle";
import {ZmInputCheckbox} from "./form/ZmInputCheckbox";
import {ZmCard} from "./card/ZmCard";
import {CitySelect} from './citySelect/citySelect';
import {ZmTable} from "./table/ZmTable";
import {ImageCropperModule} from "ngx-image-cropper";
import {ZmImgCropper} from "./ZmImgCropper/ZmImgCropper";
import {ZmBtn} from "./btn/ZmBtn";
import {ZmInputPhone} from "./form/ZmInputPhone";
import {ZmSelectString} from "./form/ZmSelectString";
import {ZmSelectNumber} from "./form/ZmSelectNumber";
import {ZmTimeSlot} from "./date/timeSlot/ZmTimeSlot";
import {ZmTime} from "./date/ZmTime";
import {ZmBtnDate} from "./btn/ZmBtnDate";
import {ZmSearchDate} from "./date/ZmSearchDate";
import {PieAngleEChartsElement} from "./charts/pieAngleCharte/pieAngleCharte";
import {LineEChartsElement} from "./charts/lineEcharts/LineEChartsElement";
import {PieChartsElement} from "./charts/pieCharte/PieChartsElement";
import {ZmGroupBarChart} from "./charts/barChart/zm-group-bar-chart";
import {NgxEchartsModule} from "ngx-echarts";
import {ZmDate} from "./date/ZmDate";
import {FlexLayoutModule} from "@angular/flex-layout";


@NgModule({
  declarations: [
    //按钮组件
    ZmBtn,
    ZmBtnNew,
    ZmBtnLarge,
    ZmBtnMd,
    ZmBtnSmall,
    ZmBtnDate,
    //date
    ZmTimeSlot,
    ZmTime,
    ZmDate,
    ZmSearchDate,
    //图表控件
    PieChartsElement,
    LineEChartsElement,
    PieAngleEChartsElement,
    ZmGroupBarChart,

    //输入框组件
    ZmInputText,
    ZmInputName,
    ZmInputTextarea,
    ZmInputTel,
    ZmInputPhone,
    ZmInputPCode,
    ZmInputPrice,
    ZmInputDiscount,
    ZmInputPeriod,
    ZmInputRadio,
    ZmInputCheckbox,
    ZmSelect,
    ZmSelectNumber,
    ZmSelectString,
    ZmListCheckbox,
    ZmTableDetail,
    ZmTable,
    ZmTableSelectSingle,

    SwitchButton,
    ZmPage,
    ZmNoData,
    ZmInputFile,
    ZmImgPreview,
    ZmSearchBox,
    ZmStorePreview,
    ZmImgCropper,

    ZmMatTable,
    ZmMatTableCheckbox,
    ZmMatTabs,
    ZmCard,
    // 城市
    CitySelect,

    AddProductPopup,
    AddGoodsPopup,
    AddPackagePopup,
    GoodsDetailModalComponent,
    ProductInfoDetailModalComponent,
    PackageDetailModalComponent,

    //指令
    NotRepeatSubmitDirective,
    SecondDisapperDirective,
    BlinkSecondDirective,
    BigImgDirective,
    AnimationModalDirective,
  ],
  imports: [
    NgbModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    SharedModule,
    ZmFuseCompModule,
    NgxEchartsModule,
    FlexLayoutModule,
    ImageCropperModule
  ],
  providers: [],
  exports: [
    ZmFuseCompModule,

    //按钮组件
    ZmBtn,
    ZmBtnNew,
    ZmBtnLarge,
    ZmBtnMd,
    ZmBtnSmall,
    ZmBtnDate,
    //date
    ZmTimeSlot,
    ZmTime,
    ZmDate,
    ZmSearchDate,

    //图表控件
    PieChartsElement,
    LineEChartsElement,
    PieAngleEChartsElement,
    ZmGroupBarChart,

    //输入框组件
    ZmInputText,
    ZmInputName,
    ZmInputTextarea,
    ZmInputTel,
    ZmInputPhone,
    ZmInputPCode,
    ZmInputPrice,
    ZmInputDiscount,
    ZmInputPeriod,
    ZmInputRadio,
    ZmInputCheckbox,
    ZmSelect,
    ZmSelectNumber,
    ZmSelectString,
    ZmListCheckbox,
    ZmTableDetail,
    ZmTable,

    SwitchButton,
    ZmPage,
    ZmNoData,
    ZmInputFile,
    ZmImgPreview,
    ZmSearchBox,
    ZmStorePreview,
    ZmImgCropper,

    ZmMatTable,
    ZmTableSelectSingle,
    ZmMatTableCheckbox,
    ZmMatTabs,
    ZmCard,
    // 城市
    CitySelect,

    AddProductPopup,
    AddGoodsPopup,
    AddPackagePopup,
    GoodsDetailModalComponent,
    ProductInfoDetailModalComponent,
    PackageDetailModalComponent,

  ],
  entryComponents: [
    AddProductPopup,
    AddGoodsPopup,
    AddPackagePopup,
    GoodsDetailModalComponent,
    ProductInfoDetailModalComponent,
    PackageDetailModalComponent,
    ZmTableSelectSingle,
  ]
})
export class ZmCompModule {
}
