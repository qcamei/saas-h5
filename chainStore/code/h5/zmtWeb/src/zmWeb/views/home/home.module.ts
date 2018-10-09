import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../common/SharedModule/SharedModule";
import {NgModule} from "@angular/core";
import {AppointmentMgr} from "../../bsModule/appointment/AppointmentMgr";
import {HomeRoutingModule} from "./home-routing.module";
import {HomePage} from "./page/home";
import {StoreLeaguerInfoBSmodule} from "../../bsModule/storeLeaguerInfo/StoreLeaguerInfo.bsmodule";
import {StoreCardInfoBSModule} from "../../bsModule/storeCardInfo/StoreCardInfo.bsmodule";
import {BUserBSModule} from "../../bsModule/buser/BUser.bsModule";
import {AppointmentBSModule} from "../../bsModule/appointment/Appointment.bsmodule";
import {WorkFlowBSmodule} from "../../bsModule/workFlow/WorkFlow.bsmodule";
import {WorkFlowTypeBSmodule} from "../../bsModule/workFlowType/WorkFlowType.bsmodule";
import {TodayAppointComp} from "./Comp/todayAppointComp/TodayAppointComp";
import {UnfinishedWFComp} from "./Comp/unfinishedWFComp/UnfinishedWFComp";
import {ZmCompModule} from "../zmComp/zmComp.module";
import {LeaguerDetailBSmodule} from "../../bsModule/leaguerDetail/LeaguerDetail.bsmodule";




@NgModule({
  declarations: [
    //page
    HomePage,
    //comp
    TodayAppointComp,
    UnfinishedWFComp,

  ],
  imports: [
    //公共module
    CommonModule,
    FormsModule,
    SharedModule,
    ZmCompModule,

    BUserBSModule,
    LeaguerDetailBSmodule,
    StoreLeaguerInfoBSmodule,
    StoreCardInfoBSModule,
    AppointmentBSModule,
    WorkFlowBSmodule,
    WorkFlowTypeBSmodule,

    //路由module
    HomeRoutingModule,

  ],
  exports:[
    TodayAppointComp,
    UnfinishedWFComp
  ],
  providers: [
    AppointmentMgr,
  ]
})

export class HomeModule {
}
