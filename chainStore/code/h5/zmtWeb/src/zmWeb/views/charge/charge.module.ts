import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ChargeBSModule} from "../../bsModule/charge/Charge.bsmodule";
import {ChargeViewDataMgr} from "./chargeViewDataMgr";
import {ChargeRoutingModule} from "./charge-routing.module";
import {ChargePage} from "./charge/charge";
import { ZmCompModule } from "../zmComp/zmComp.module";
import { SharedModule } from "../common/SharedModule/SharedModule";
import {VipLevelBSModule} from "../../bsModule/vipLevel/VipLevel.bsModule";
import {ChargePayPage} from "./chargePay/chargePay";
import { ChargeScanComp } from "./chargePay/chargeScanComp/chargeScanComp";
import { PaySucceedComp } from "./chargePay/paySucceedComp/paySucceedComp";
import { ChargeListPage } from "./chargeList/chargeList";
import { MembersExpired } from "./chargePay/MembersExpired/MembersExpired";
import {PayBSmodule} from "../../bsModule/pay/Pay.bsmodule";
import {ChargeGuard} from "./charge/chargeGuard";

@NgModule({
  declarations:[
    ChargePage,
    ChargePayPage,
    ChargeScanComp,
    PaySucceedComp,
    ChargeListPage,
    MembersExpired
  ],
  imports:[
    //公共模块
    CommonModule,
    FormsModule,
    ZmCompModule,
    SharedModule,
    // 轮播

    //业务
    ChargeBSModule,
    VipLevelBSModule,
    PayBSmodule,

    //路由
    ChargeRoutingModule,
  ],
  providers:[
    ChargeViewDataMgr,
    ChargeGuard,
  ],
  entryComponents: [
    ChargeScanComp,
    PaySucceedComp,
    MembersExpired,
  ]
})
export class ChargeModule{}
