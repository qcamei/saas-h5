import {NgModule} from '@angular/core';
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
import {ZmkOwenItem} from "./zmk/ZmkOwenItem";
import {ZmkAppointmentItem} from "./zmk/ZmkAppointmentItem";
import {ZmkShopCart} from "./zmk/ZmkShopCart";
import {ZmkShopCartItem} from "./zmk/ZmkShopCartItem";
import {ZmStoreInfo} from "./ZmStoreInfo";
import {ZmkOwenItemInfo} from './zmk/ZmkOwenItemInfo';
import {ZmkAppointmentList} from './zmk/ZmkAppointmentList';
import {ZmkAddress} from './zmk/ZmkAddress';
import {ZmInputModule} from '../zmComp/form/zmInput.module';
import {ZmkStoreCard} from "./zmk/ZmkStoreCard";
import {ZmkPayInfo} from './zmk/ZmkPayInfo';
import {ZmkTitle} from './zmk/ZmkTitle';
import {ZmkGoodsSearch} from "./zmk/ZmkGoodsSearch";
import {ZmWorkerInfo} from "./ZmWorkerInfo";
import {ZmkAddressItem} from "./zmk/ZmkAddressItem";
import {ZmkAddressSelectItem} from "./zmk/ZmkAddressSelectItem";
import {ZmbManagerTitle} from "./zmb/ZmbManagerTitle";
import {ZmbUserInfo} from "./zmb/ZmbUserInfo";
import {ZmbSmsPhone} from "./zmb/ZmbSmsPhone";
import {ZmbGenderSelectItem} from "./zmb/ZmbGenderSelectItem";
import {ZmbAppointItem} from "./zmb/ZmbAppointItem";
import {ZmbAppointList} from "./zmb/ZmbAppointList";
import {ZmCompModule} from "../zmComp/zmComp.module";
import {ZmbItem} from "./zmb/ZmbItem";
import {ZmbLeaguerList} from "./zmb/ZmbLeaguerList";
import {ZmbLeaguerInfoComp} from "./zmb/leaguerInfo/ZmbLeaguerInfoComp";
import {ZmbManageGroup} from "./zmb/manage/group/ZmbManageGroup";
import {ZmbManageItem} from "./zmb/manage/itemInGroup/ZmbManageItem";
import {ZmbUserDetailItem} from "./zmb/ZmbUserDetailItem";
import {ZmbOrderInnerItem} from "./zmb/order/ZmbOrderInnerItem";
import {ZmbOrderItem} from "./zmb/order/ZmbOrderItem";
import {ZmbOrderRechargeItem} from "./zmb/order/ZmbOrderRechargeItem";
import {ZmbMessage} from "./zmb/ZmbMessage";
import {ZmbLeaguerInfoWithOperateComp} from "./zmb/leaguerInfo/ZmbLeaguerInfoWithOperateComp";
import {ZmbPasswordItem} from "./zmb/ZmbPasswordItem";
import {ZmbOrderDetailItem} from "./zmb/order/ZmbOrderDetailItem";
import {ZmbPayInfo} from "./zmb/order/ZmbPayInfo";
import {ZmbWfItem} from "./zmb/ZmbWfItem";
import {WorkFlowTitle} from "./zmb/workFlow/workFlowTitle";
import {ZmbPickerSelect} from "./zmb/picker/zmbPicker/ZmbPickerSelect";
import {ZmbAppointDetailItem} from "./zmb/ZmbAppointDetailItem";
import {ZmbOpenWFSelectComp} from "./zmb/workFlow/openWFGroup/ZmbOpenWFSelectComp";
import {ZmbBUserComp} from "./zmb/buser/info/ZmbBUserComp";
import {ZmbBUserSelectComp} from "./zmb/buser/select/ZmbBUserSelectComp";
import {LeaguerSelectComp} from "./zmb/leaguerSelect/leaguerSelectComp/leaguerSelect.comp";
import {ZmbAppointProductItem} from "./zmb/ZmbAppointProductItem";
import {ZmbSelectStaffComp} from "./zmb/ZmbSelectStaffComp";@NgModule({
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
    ZmkShopCart,
    ZmkShopCartItem,
    ZmStoreInfo,
    ZmkAddress,
    ZmkStoreCard,
    ZmkPayInfo,
    ZmkTitle,
    ZmkGoodsSearch,
    ZmWorkerInfo,
    ZmkAddressItem,
    ZmkAddressSelectItem,

    // Zmb
    ZmbManagerTitle,
    ZmbUserInfo,
    ZmbSmsPhone,
    ZmbGenderSelectItem,
    ZmbItem,
    //appointment
    ZmbAppointItem,
    ZmbAppointList,
    ZmbAppointDetailItem,
    ZmbAppointProductItem,

    ZmbLeaguerList,
    ZmbWfItem,
    ZmbLeaguerInfoComp,
    ZmbLeaguerInfoWithOperateComp,
    ZmbManageGroup,
    ZmbManageItem,
    ZmbUserDetailItem,
    ZmbMessage,
    //order
    ZmbOrderInnerItem,
    ZmbOrderRechargeItem,
    ZmbOrderItem,
    ZmbPasswordItem,
    ZmbOrderDetailItem,
    ZmbPayInfo,
    // workflow
    WorkFlowTitle,
    ZmbOpenWFSelectComp,

    ZmbPickerSelect,

    ZmbBUserComp,
    ZmbBUserSelectComp,
    LeaguerSelectComp,
    ZmbSelectStaffComp,

  ],

  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ZmPipeModule,
    FlexLayoutModule,
    ZmInputModule,
    SharedModule,
    ZmCompModule,
  ],
  providers: [],

  exports: [
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
    ZmkShopCart,
    ZmkShopCartItem,
    ZmStoreInfo,
    ZmkAddress,
    ZmkStoreCard,
    ZmkPayInfo,
    ZmkTitle,
    ZmkGoodsSearch,
    ZmWorkerInfo,
    ZmkAddressItem,
    ZmkAddressSelectItem,

    // Zmb
    ZmbManagerTitle,
    ZmbUserInfo,
    ZmbSmsPhone,
    ZmbGenderSelectItem,
    ZmbItem,
    //appointment
    ZmbAppointItem,
    ZmbAppointList,
    ZmbAppointDetailItem,
    ZmbAppointProductItem,

    ZmbLeaguerList,
    ZmbWfItem,
    ZmbLeaguerInfoComp,
    ZmbLeaguerInfoWithOperateComp,
    ZmbManageGroup,
    ZmbManageItem,
    ZmbOrderInnerItem,
    ZmbOrderRechargeItem,
    ZmbOrderItem,
    ZmbMessage,
    ZmbOrderDetailItem,
    ZmbPayInfo,
    ZmbOpenWFSelectComp,
    WorkFlowTitle,
    ZmbPasswordItem,
    ZmbUserDetailItem,

    ZmbPickerSelect,

    ZmbBUserComp,
    ZmbBUserSelectComp,
    LeaguerSelectComp,
    ZmbSelectStaffComp,
  ]
})
export class ZmBsCompModule {

  constructor() {
  }

}
