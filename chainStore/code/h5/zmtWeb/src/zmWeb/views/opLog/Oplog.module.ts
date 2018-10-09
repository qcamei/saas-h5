import {OpLogListPage} from "./opLogList/OpLogList";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../common/SharedModule/SharedModule";
import {ZmCompModule} from "../zmComp/zmComp.module";
import {OpLogBsmodule} from "../../bsModule/opLog/OpLog.bsmodule";
import {OplogRoutingModule} from "./Oplog-routing.module";
import {OplogViewDataMgr} from "./OplogViewDataMgr";
import {NgModule} from "@angular/core";

@NgModule({
  declarations:[
    //page
    OpLogListPage,

  ],
  imports:[
    //公共module
    CommonModule,
    FormsModule,
    SharedModule,
    ZmCompModule,

    //业务module
    OpLogBsmodule,

    //路由module
    OplogRoutingModule,

  ],
  exports:[
    //page
    OpLogListPage
  ],
  providers:[
    OplogViewDataMgr,
  ],

  entryComponents: [
  ],

})

export class OplogModule{

}
