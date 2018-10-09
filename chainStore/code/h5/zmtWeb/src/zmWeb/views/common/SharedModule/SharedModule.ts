import {NgModule} from "@angular/core";
import {UploadImage} from "./../UploadImage/UploadImage";
import {ViewHeader} from "./../Comp/viewHeader/viewHeader";
import {ViewBody} from "./../Comp/viewBody/viewBody";
import {FormatNumberComp} from "../formatNumber/MoneyInput";
import {DiscountInput} from "../formatNumber/DiscountInput";
import {NumberInputComp} from "../formatNumber/NumberInputComp";
import {ZmtEnabled} from "../formCheck/ZmtDisabled";
import {ZmtFVField} from "../formCheck/ZmtFVField";
import {PriceInput} from "../formatNumber/PriceInput";
import {CommonModule, DecimalPipe} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ImgPrePathPipe} from "../pipe/ImgPrePathPipe";
import {LeaguerNamePipe} from "../pipe/LeaguerNamePipe";
import {TimesPipe} from "../pipe/Times.pipe";
import {GoodsStatePipe, GoodsStatePipe2} from "../pipe/GoodsStatePipe";
import {GoodsTypePipe} from "../pipe/GoodsTypePipe";
import {GoodsNamePipe} from "../pipe/GoodsNamePipe";
import {ProductStatePipe, ProductStatePipe2} from "../pipe/ProductStatePipe";
import {ProductNamePipe} from "../pipe/ProductNamePipe";
import {ProductTypePipe} from "../pipe/ProdcutTypePipe";
import {ItemTypePipe} from "../pipe/ItemTypePipe";
import {PackageStatePipe, PackageStatePipe2} from "../pipe/PackageStatePipe";
import {PackageTypePipe} from "../pipe/PackageTypePipe";
import {BuyTypePipe} from "../pipe/BuyTypePipe";
import {OrderPayTypePipe} from "../pipe/OrderPayTypePipe";
import {OrderStatusPipe, RechargeStatusPipe} from "../pipe/OrderStatusPipe";
import {PrdCardPayPipe} from "../pipe/PrdCardPayPipe";
import {OrderBuyTypePipe} from "../pipe/OrderBuyTypePipe";
import {DiscountPipe} from "../pipe/DiscountPipe";
import {PrdCardTypeNamePipe} from "../pipe/PrdCardTypeNamePipe";
import {ChainSynStatusPipe} from "../pipe/ChainSynStatusPipe";
import {ValidPeriodUnitPipe} from "../pipe/ValidPeriodUnitPipe";
import {ProductCardItemTypePipe} from "../pipe/ProductCardItemTypePipe";
import {LeaguerCardEnumPipe} from "../pipe/LeaguerCardEnumPipe";
import {AttrListPipe} from "../pipe/AttrListPipe";
import {OrderItemTypePipeComp} from "../pipe/orderItemTypePipeComp";
import {ProductCardTypePipeComp} from "../pipe/productCardTypePipeComp";
import {DatetimePipeComp} from "../pipe/datetimePipeComp";
import {ReduceCardItemTypePipe} from "../pipe/reduceCardItemTypePipe";
import {PricePipe} from "../pipe/PricePipe";
import {ChargeChannelPipe} from "../pipe/ChargeChannelPipe";
import {ChargeStatusPipe} from "../pipe/ChargeStatusPipe";
import {ChargeTypePipe} from "../pipe/ChargeTypePipe";
import {MembershipCardNamePipe} from "../pipe/MembershipCardNamePipe";


@NgModule({
  imports:[
    CommonModule,
    FormsModule
  ],
  declarations:[

    UploadImage, //上传图片组件
    ViewHeader, //页面头部
    ViewBody, //页面内容

    ImgPrePathPipe,
    LeaguerNamePipe,
    TimesPipe,
    GoodsStatePipe,
    GoodsStatePipe2,
    GoodsTypePipe,
    GoodsNamePipe,
    ProductStatePipe,
    ProductStatePipe2,
    ProductNamePipe,
    ProductTypePipe,
    ItemTypePipe,
    PackageStatePipe,
    PackageStatePipe2,
    PackageTypePipe,
    BuyTypePipe,
    OrderPayTypePipe,
    OrderStatusPipe,
    RechargeStatusPipe,
    PrdCardPayPipe,
    OrderBuyTypePipe,
    DiscountPipe,
    PrdCardTypeNamePipe,
    ChainSynStatusPipe,
    ValidPeriodUnitPipe,
    ProductCardItemTypePipe,
    LeaguerCardEnumPipe,
    AttrListPipe,
    OrderItemTypePipeComp,
    ProductCardTypePipeComp,
    DatetimePipeComp,
    ReduceCardItemTypePipe,
    PricePipe,
    ChargeChannelPipe,
    ChargeStatusPipe,
    ChargeTypePipe,
    MembershipCardNamePipe,

    FormatNumberComp,
    ZmtFVField,
    ZmtEnabled,
    NumberInputComp,

    PriceInput,
    DiscountInput,



  ],
  exports: [
    UploadImage, //上传图片组件
    ViewHeader, //页面头部
    ViewBody, //页面内容

    ImgPrePathPipe,
    LeaguerNamePipe,
    TimesPipe,
    GoodsStatePipe,
    GoodsStatePipe2,
    GoodsTypePipe,
    GoodsNamePipe,
    ProductStatePipe,
    ProductStatePipe2,
    ProductNamePipe,
    ProductTypePipe,
    ItemTypePipe,
    PackageStatePipe,
    PackageStatePipe2,
    PackageTypePipe,
    BuyTypePipe,
    OrderPayTypePipe,
    OrderStatusPipe,
    RechargeStatusPipe,
    PrdCardPayPipe,
    OrderBuyTypePipe,
    DiscountPipe,
    PrdCardTypeNamePipe,
    ChainSynStatusPipe,
    ValidPeriodUnitPipe,
    ProductCardItemTypePipe,
    LeaguerCardEnumPipe,
    AttrListPipe,
    OrderItemTypePipeComp,
    ProductCardTypePipeComp,
    DatetimePipeComp,
    ReduceCardItemTypePipe,
    PricePipe,
    ChargeChannelPipe,
    ChargeStatusPipe,
    ChargeTypePipe,
    MembershipCardNamePipe,

    FormatNumberComp,
    ZmtFVField,
    ZmtEnabled,
    NumberInputComp,

    PriceInput,
    DiscountInput,
  ],


//日历
  providers: [
    DecimalPipe
    // I18n,
    // {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}
    ]
})

export class SharedModule {}
