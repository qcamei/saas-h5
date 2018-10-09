import {NgModule} from "@angular/core";
import { ChargeRoutingModule } from "./charge-routing.module";
import { ChargeListPage } from "./chargeList/chargeList";
import {ZmCompModule} from "../zmComp/zmComp.module";
import {SharedModule} from "../common/SharedModule/SharedModule";
import { AddChargePage } from "./addCharge/addCharge";
import { EditChargePage } from "./editCharge/editCharge";
import {ChargeBSModule} from "../../bsModule/charge/Charge.bsmodule";
import {ChargeViewDataMgr} from "./ChargeViewDataMgr";
import {BUserBSModule} from "../../bsModule/buser/BUser.bsModule";
import {VipLevelBSModule} from "../../bsModule/vipLevel/VipLevel.bsmodule";
import {SelectBuserPopup} from "./addCharge/selectBuserPopup";
import {ChargeChannelPipe} from "./pipe/chargeChannelPipe";

@NgModule({
  declarations: [
    ChargeListPage,
    AddChargePage,
    EditChargePage,

    //popup
    SelectBuserPopup,
    //pipe
    ChargeChannelPipe
  ],
  imports: [
    ChargeRoutingModule,
    ZmCompModule,
    SharedModule,

    //业务模块
    ChargeBSModule,
    BUserBSModule,
    VipLevelBSModule,

  ],
  providers: [
    ChargeViewDataMgr,
  ],
  exports: [],
  entryComponents: [
    //popup
    SelectBuserPopup,
  ]
})
export class ChargeModule {
}
