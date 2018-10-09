import { NgModule } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {IonicModule} from "ionic-angular";
import {ZmPipeModule} from "../zmComp/pipe/zmPipe.module";
import {ZmUserInfo} from "./ZmUserInfo";
import {ZmMemCardInfo} from "./ZmMemCardInfo";
import {SharedModule} from "../common/SharedModule";
import {ZmCol} from "./zm-col";
import {ZmCardImg} from "./zm-card-img";
import {ZmPrdCardInfo} from "./ZmPrdCardInfo";
import {ZmkGoodsItem} from "./zmk/ZmkGoodsItem";
import {FlexLayoutModule} from "@angular/flex-layout";
import {ZmPrdInfo} from "./ZmPrdInfo";
import {ZmkOrderItem} from "./zmk/ZmkOrderItem";
import {ZmkOwenItem} from "./zmk/ZmkOwenItem";
import {ZmkAppointmentItem} from "./zmk/ZmkAppointmentItem";
import {ZmkShopCart} from "./zmk/ZmkShopCart";
import {ZmkShopCartItem} from "./zmk/ZmkShopCartItem";
import {ZmStoreInfo} from "./ZmStoreInfo";
import {ZmkInnerItem} from "./zmk/ZmkInnerItem";
import { ZmkOwenItemInfo } from './zmk/ZmkOwenItemInfo';
import { ZmkAppointmentList } from './zmk/ZmkAppointmentList';
import { ZmkAddress } from './zmk/ZmkAddress';
import { ZmInputModule } from '../zmComp/form/zmInput.module';
import {ZmkStoreCard} from "./zmk/ZmkStoreCard";
import { ZmkPayInfo } from './zmk/ZmkPayInfo';
import { ZmkTitle } from './zmk/ZmkTitle';
import {ZmkGoodsSearch} from "./zmk/ZmkGoodsSearch";
import {ZmWorkerInfo} from "./ZmWorkerInfo";
import {ZmkAddressItem} from "./zmk/ZmkAddressItem";
import {ZmkAddressSelectItem} from "./zmk/ZmkAddressSelectItem";

@NgModule({
  declarations: [
    ZmUserInfo,
    ZmMemCardInfo,
    ZmPrdCardInfo,
    ZmCol,
    ZmCardImg,
    ZmPrdInfo,
    ZmkAppointmentItem,
    ZmkAppointmentList,
    ZmkGoodsItem,
    ZmkOwenItem,
    ZmkOwenItemInfo,
    ZmkOrderItem,
    ZmkShopCart,
    ZmkShopCartItem,
    ZmStoreInfo,
    ZmkInnerItem,
    ZmkAddress,
    ZmkStoreCard,
    ZmkPayInfo,
    ZmkTitle,
    ZmkGoodsSearch,
    ZmWorkerInfo,
    ZmkAddressItem,
    ZmkAddressSelectItem,



  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ZmPipeModule,
    FlexLayoutModule,
    ZmInputModule,
    SharedModule
  ],
  providers: [],

  exports:[
    ZmUserInfo,
    ZmMemCardInfo,
    ZmPrdCardInfo,
    ZmCol,
    ZmCardImg,
  	ZmPrdInfo,
    ZmkAppointmentItem,
    ZmkAppointmentList,
    ZmkGoodsItem,
    ZmkOwenItem,
    ZmkOwenItemInfo,
    ZmkOrderItem,
    ZmkShopCart,
    ZmkShopCartItem,
    ZmStoreInfo,
    ZmkInnerItem,
    ZmkAddress,
    ZmkStoreCard,
    ZmkPayInfo,
    ZmkTitle,
    ZmkGoodsSearch,
    ZmWorkerInfo,
    ZmkAddressItem,
    ZmkAddressSelectItem,

  ]
})
export class ZmBsCompModule {

  constructor(){
  }

}
