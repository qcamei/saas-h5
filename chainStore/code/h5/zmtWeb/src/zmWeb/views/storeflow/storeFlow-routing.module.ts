import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {RechargePage} from "./storeRecharge/recharge";
import {ConsumePage} from "./storeConsume/consume";
import {ConsumeUnsettledGuard} from "./consumeUnsettledGuard";
import {RechargeUnsettledGuard} from "./rechargeUnsettledGuard";

const mRoutes:Routes = [

  {
    path: "recharge/:workFlowId",
    component: RechargePage,
    // canDeactivate:[RechargeUnsettledGuard]
  },
  {
    path: "consume/:workFlowId",
    component: ConsumePage,
    // canDeactivate:[ConsumeUnsettledGuard]
  },
  // {
  //   path: "cuserWFComp",
  //   component: CuserWFComp,
  // },
  // {
  //   path: "buserWFComp",
  //   component: BuserWFComp,
  // },
  // {
  //   path: "selectProductComp",
  //   component: SelectProductComp,
  // },
  // {
  //   path: "selectStaffComp",
  //   component: SelectStaffComp,
  // },
  // {
  //   path: "selectGoodsComp",
  //   component: SelectGoodsComp,
  // },
  // {
  //   path: "selectCardComp",
  //   component: SelectCardComp,
  // },
  // {
  //   path: "bonusComp",
  //   component: BonusComp,
  // },
  // {
  //   path: "orderComp",
  //   component: OrderComp,
  // },
  // {
  //   path:"billComp",
  //   component:BillComp
  // },
  // {
  //   path:"rechargeSettingComp",
  //   component:RechargeSettingComp
  // }
];

@NgModule({
  imports: [
    RouterModule.forChild(mRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
  ]
})
export class StoreFlowRoutingModule { }
