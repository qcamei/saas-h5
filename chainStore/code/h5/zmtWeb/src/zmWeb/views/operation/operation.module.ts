import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {OperationPage} from "./operation/operation";
import {OperationDialog} from "./dialog/operationDialog";
import {OperationRoutingModule} from "./operation-routing.module";
import {SharedModule} from "./../common/SharedModule/SharedModule";
import {WorkFlowBSmodule} from "../../bsModule/workFlow/WorkFlow.bsmodule";
import {StoreLeaguerInfoBSmodule} from "../../bsModule/storeLeaguerInfo/StoreLeaguerInfo.bsmodule";
import {WorkFlowTypeBSmodule} from "../../bsModule/workFlowType/WorkFlowType.bsmodule";
import {OperationStatePipe} from "./Pipe/OperationStatuPipe";
import {OperationViewDataMgr} from "./OperationViewDataMgr";
import {ZmCompModule} from "../zmComp/zmComp.module";
@NgModule({
  declarations: [
    OperationPage,
    OperationStatePipe,
    OperationDialog
  ],
  imports: [
    CommonModule,
    FormsModule,
    //组件Module
    SharedModule,
    ZmCompModule,
    //业务模块
    WorkFlowBSmodule,
    WorkFlowTypeBSmodule,
    StoreLeaguerInfoBSmodule,
    //路由
    OperationRoutingModule,
  ],
  providers: [
    OperationViewDataMgr,
  ],
  entryComponents: [
    OperationDialog
  ]
})
export class OperationModule {
}
