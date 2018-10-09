import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {ChargePage} from "./charge/charge";
import {ChargePayPage} from "./chargePay/chargePay";
import { ChargeListPage } from "./chargeList/chargeList";
import {ChargeGuard} from "./charge/chargeGuard";

const mRoutes:Routes = [
  {
    path:"vipCharge",
    component:ChargePage,
    canDeactivate: [ChargeGuard]
  },
  {
    path:"chargePay/:chargeId",
    component:ChargePayPage,
  },
  {
    path:"chargeList",
    component:ChargeListPage,
  },

];

@NgModule({
  imports:[
    RouterModule.forChild(mRoutes),
  ],
  exports:[

  ]
})
export class ChargeRoutingModule{}
