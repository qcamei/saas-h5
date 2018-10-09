import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {NgModule} from "@angular/core";
import {SharedModule} from "../common/SharedModule/SharedModule";
import {AppointmentListPage} from "./appointmentList/appointmentList";
import {AppointmentDetailsPage} from "./appointmentDetails/appointmentDetails";
import {AppointmentRoutingModule} from "./Appointment-routing.module";
import {AddAppointmentPage} from "./addAppointment/addAppointment";
import {AppointmentViewDataMgr} from "./AppointmentViewDataMgr";
import {StoreLeaguerInfoModule} from "../storeLeaguerInfo/storeLeaguerInfo.module";
import {AppointmentBSModule} from "../../bsModule/appointment/Appointment.bsmodule";
import {AppointmentStatusPipe} from "./Pipe/AppointmentStatusPipe";
import {OriginTypePipe} from "./Pipe/OriginTypePipe";
import {StoreFlowModule} from "../storeflow/storeFlow.module";
import {StoreCardInfoModule} from "../storeCardInfo/storeCardInfo.module";
import {BUserModule} from "../buser/buser.module";
import {LeaguerComp} from "./Comp/leaguerComp/leaguerComp";
import {ProductComp} from "./Comp/ProductComp/productComp";
import {ServicePersonComp} from "./Comp/servicePersonComp/servicePersonComp";
import {
  ServicePersonPopup
} from "./Comp/servicePersonComp/servicePersonPopupComp/servicePersonPopupComp";
import {ProductPopup} from "./Comp/ProductComp/ProductPopupComp/productPopupComp";
import {AppointDataWraperMgr} from "./addAppointWraper/AddAppointDataWraperMgr";
import {
  ProductCardPopup
} from "./Comp/ProductComp/productCardComp/productCardComp";
import {LeaguerPopup} from "./Comp/leaguerComp/leaguerPopupComp/leaguerPopup";
import {ZmCompModule} from "../zmComp/zmComp.module";

import {StoreProductInfoModule} from "../storeProductInfo/storeProduct.module";
import {CancelAppointComp} from "./Comp/cancelAppointmentComp/cancelAppointmentComp";
import {StoreConfigBSmodule} from "../../bsModule/storeConfig/StoreConfig.bsmodule";
import {AppointTimeComp} from "./Comp/appointTimeComp/AppointTimeComp";
import {AppointDetailComp} from "./appointmentDetails/appointDetailComp";


@NgModule({
  declarations: [
    //page
    AppointmentListPage,
    AppointmentDetailsPage,
    AddAppointmentPage,

    //pipe
    AppointmentStatusPipe,
    OriginTypePipe,

    //comp
    LeaguerComp,
    LeaguerPopup,
    CancelAppointComp,
    ProductComp,
    ProductPopup,
    ProductCardPopup,
    AppointDetailComp,//预约详情组件

    ServicePersonComp,
    ServicePersonPopup,
    AppointTimeComp,

  ],
  imports: [
    //公共module
    CommonModule,
    FormsModule,
    //组件module
    SharedModule,
    ZmCompModule,

    AppointmentBSModule,
    //路由module
    AppointmentRoutingModule,

    //依赖模块
    StoreLeaguerInfoModule,
    StoreCardInfoModule,
    StoreProductInfoModule,
    BUserModule,
    //公共组件
    StoreFlowModule,
    StoreConfigBSmodule,

  ],
  exports:[

  ],
  providers: [
    AppointmentViewDataMgr,
    AppointDataWraperMgr,
  ],
  entryComponents: [
    LeaguerPopup,
    ProductPopup,
    ProductCardPopup,
    ServicePersonPopup,
    CancelAppointComp,
    AppointTimeComp,
    //page
    AppointDetailComp,//预约详情组件
  ],

})

export class AppointmentModule {
}

