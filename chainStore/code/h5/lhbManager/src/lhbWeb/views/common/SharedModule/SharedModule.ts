
import {NgModule} from "@angular/core";
//功能组件
import {SwitchButton} from "./../SwitchButton/SwitchButton";
import {ThemeModule} from "./../../../../app/@theme/theme.module";
import {UploadImage} from "./../UploadImage/UploadImage";
import {Pagination} from "./../Pagination/Pagination";
import {CitySelect} from "./../citySelect/citySelect";
import {ViewHeader} from "./../Comp/viewHeader/viewHeader";
import {ViewBody} from "./../Comp/viewBody/viewBody";
//过滤器
import {ImgPrePathPipe} from "../Pipe/ImgPrePathPipe";

// 时间汉化
import {I18n, CustomDatepickerI18n} from "../zhcn/zhcn";
import {NgbDatepickerI18n,} from '@ng-bootstrap/ng-bootstrap';
import {FormatNumberComp} from "../formatNumber/MoneyInput";
import {DiscountInput} from "../formatNumber/DiscountInput";
import {NumberInputComp} from "../formatNumber/NumberInputComp";
import {ZmtEnabled} from "../formCheck/ZmtDisabled";
import {ZmtFVField} from "../formCheck/ZmtFVField";
import {PriceInput} from "../formatNumber/PriceInput";
import {ViewFigure} from "../Comp/viewFigure/viewFigure";



@NgModule({
  imports:[
    ThemeModule
  ],
  declarations:[

    SwitchButton, //SwitchButton组件
    UploadImage, //上传图片组件
    Pagination,//分页器
    CitySelect,//城市选择

    ViewHeader, //页面头部
    ViewBody, //页面内容
    ViewFigure,

    ImgPrePathPipe,


    FormatNumberComp,
    ZmtFVField,
    ZmtEnabled,
    NumberInputComp,

    PriceInput,
    DiscountInput,



  ],
  exports: [
    ThemeModule,
    ImgPrePathPipe,
    SwitchButton,
    UploadImage,
    Pagination,
    CitySelect,
    ViewHeader,
    ViewBody,
    ViewFigure,
    FormatNumberComp,
    PriceInput,
    DiscountInput,

  ],


//日历
  providers: [
    I18n,
    {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}]
})

export class SharedModule {}
