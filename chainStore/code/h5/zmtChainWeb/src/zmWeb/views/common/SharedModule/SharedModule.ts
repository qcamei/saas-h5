import {NgModule} from "@angular/core";
import {UploadImage} from "./../UploadImage/UploadImage";
import {Pagination} from "./../Pagination/Pagination";
// import {CitySelect} from "./../citySelect/citySelect";
import {ViewBody} from "./../Comp/viewBody/viewBody";
import {ImgPrePathPipe} from "../pipe/ImgPrePathPipe";
import {I18n, CustomDatepickerI18n} from "../zhcn/zhcn";
import {NgbDatepickerI18n, NgbModule,} from '@ng-bootstrap/ng-bootstrap';
import {FormatNumberComp} from "../formatNumber/MoneyInput";
import {DiscountInput} from "../formatNumber/DiscountInput";
import {PriceInput} from "../formatNumber/PriceInput";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import { TimesPipe } from "../pipe/times.pipe";
import {GoodsTypePipe} from "../pipe/GoodsTypePipe";
import {ProductNamePipe} from "../pipe/ProductNamePipe";
import {ItemTypePipe} from "../pipe/ItemTypePipe";
import {GoodsNamePipe} from "../pipe/GoodsNamePipe";
import {ProductTypePipe} from "../pipe/ProdcutTypePipe";
import {PackageTypePipe} from "../pipe/PackageTypePipe";
import {DiscountPipe} from "../pipe/DiscountPipe";
import {PrdCardTypeNamePipe} from "../pipe/PrdCardTypeNamePipe";
import {StatePipe, StatePipe2} from "../pipe/StatePipe";
import {MemCardStatePipe, MemCardStatePipe2} from "../pipe/MemCardStatePipe";
import {GenderPipe} from "../pipe/GenderPipe";
import {ViewHeader} from "../Comp/viewHeader/viewHeader";


@NgModule({
  imports:[
    NgbModule,
    CommonModule,
    FormsModule
  ],
  declarations:[

    UploadImage, //上传图片组件
    Pagination,//分页器
    // CitySelect,//城市选择

    ViewBody, //页面内容
    ViewHeader,

    ImgPrePathPipe,
    TimesPipe,
    GoodsTypePipe,
    GoodsNamePipe,
    ProductNamePipe,
    ProductTypePipe,
    ItemTypePipe,
    PackageTypePipe,
    DiscountPipe,
    PrdCardTypeNamePipe,
    StatePipe,
    StatePipe2,
    MemCardStatePipe,
    MemCardStatePipe2,
    GenderPipe,
    FormatNumberComp,
    PriceInput,
    DiscountInput,




  ],
  exports: [
    ImgPrePathPipe,
    TimesPipe,
    GoodsTypePipe,
    GoodsNamePipe,
    ProductNamePipe,
    ProductTypePipe,
    PackageTypePipe,
    ItemTypePipe,
    PrdCardTypeNamePipe,
    DiscountPipe,
    StatePipe,
    StatePipe2,
    MemCardStatePipe,
    MemCardStatePipe2,
    GenderPipe,

    UploadImage,
    Pagination,
    // CitySelect,
    ViewBody,
    ViewHeader,
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
