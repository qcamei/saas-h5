import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../common/SharedModule/SharedModule";
import {ZmCompModule} from "../zmComp/zmComp.module";
import {NgModule} from "@angular/core";
import {CheckDayRoutingModule} from "./checkDay-routing.module";
import {CheckDayListPage} from "./checkDayList/checkDayList";
import {checkDayHandPage} from "./checkDayHand/checkDayHand";
import {CheckDayHandDetailPage} from "./checkDayHandDetail/checkDayHandDetail";
import {DaySnapshotBsmodule} from "../../bsModule/checkDay/DaySnapshot.bsmodule";
import {CheckDayViewDataMgr} from "./checkDayViewDataMgr";
import {OpLogMgr} from "../../bsModule/opLog/OpLogMgr";

@NgModule({
  declarations: [
    //page
    CheckDayListPage,
    checkDayHandPage,
    CheckDayHandDetailPage
  ],
  imports: [
    //公共module
    CommonModule,
    FormsModule,
    SharedModule,
    ZmCompModule,

    //业务module
    DaySnapshotBsmodule,

    //路由module
    CheckDayRoutingModule,


  ],
  exports: [
    //page
  ],
  providers: [
    CheckDayViewDataMgr,
    OpLogMgr,
  ],

  entryComponents: [],

})

export class CheckDayModule {

}
