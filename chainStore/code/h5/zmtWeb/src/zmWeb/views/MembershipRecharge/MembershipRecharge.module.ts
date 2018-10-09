import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "./../common/SharedModule/SharedModule";
import {ZmCompModule} from "../zmComp/zmComp.module";
import {MembershipRechargeRoutingModule} from "./MembershipRecharge-routing.module";
import {MembershipRechargeViewDataMgr} from "./MembershipRechargeViewDataMgr";
import {RechargeListPage} from "./rechargeList/rechargeList";
import {OrderBSmodule} from "../../bsModule/order/Order.bsmodule";
import {OrderNotesBSModule} from "../../bsModule/orderNotes/OrderNotes.bsModule";

@NgModule({
  declarations: [
    RechargeListPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    //组件Module
    SharedModule,
    ZmCompModule,
    //业务模块
    OrderBSmodule,
    OrderNotesBSModule,
    MembershipRechargeRoutingModule,
  ],
  providers: [
    MembershipRechargeViewDataMgr,
  ],
  entryComponents: [

  ]
})
export class MembershipRechargeModule {
}
