
import {Routes, RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {RechargeListPage} from "./rechargeList/rechargeList";

const mRoutes: Routes = [
  {
    path: 'list',
    component: RechargeListPage,
  },

];

@NgModule({
  imports: [
    RouterModule.forChild(mRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: []
})
export class MembershipRechargeRoutingModule {
}
