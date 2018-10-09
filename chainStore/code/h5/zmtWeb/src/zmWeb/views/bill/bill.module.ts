import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillListPage } from './billList/billList';
import { BillRoutingModule } from './bill-routing.module';
import { ZmCompModule } from '../zmComp/zmComp.module';
import { SharedModule } from '../common/SharedModule/SharedModule';
import { CancelBillPopup } from './comp/cancelBillPopup';
import {BillDetailPage} from "./billDetail/billDetail";
import {BillViewDataMgr} from "./billViewDataMgr";
import {WorkFlowBSmodule} from "../../bsModule/workFlow/WorkFlow.bsmodule";
import {StoreLeaguerInfoBSmodule} from "../../bsModule/storeLeaguerInfo/StoreLeaguerInfo.bsmodule";
import {WorkFlowTypeBSmodule} from "../../bsModule/workFlowType/WorkFlowType.bsmodule";
import {FormsModule} from "@angular/forms";
import {BillProgressComp} from "./comp/billProgress";
import {StoreFlowModule} from "../storeflow/storeFlow.module";
import {AppointmentModule} from "../appointment/Appointment.module";
import {OrderModule} from "../order/order.module";
import {RecordListComp} from "./comp/recordListComp/recordListComp";
import {RecordListViewDataMgr} from "./comp/recordListComp/recordListViewDataMgr";

@NgModule({
  declarations: [
    BillListPage,
    BillDetailPage,
    //组件
    BillProgressComp,
    RecordListComp,//跟进记录列表组件
    //popup
    CancelBillPopup,
  ],
  imports: [
    CommonModule,
    FormsModule,
    // 组件模块
    ZmCompModule,
    SharedModule,
    //业务
    WorkFlowBSmodule,
    WorkFlowTypeBSmodule,
    StoreLeaguerInfoBSmodule,
    //page
    StoreFlowModule,
    AppointmentModule,
    OrderModule,
    //路由
    BillRoutingModule,
  ],
  providers:[
    BillViewDataMgr,
    RecordListViewDataMgr,
  ],
  entryComponents: [
    //组件
    BillProgressComp,
    RecordListComp,//跟进记录列表组件
    //popup
    CancelBillPopup,
  ]
})
export class BillModule {}
