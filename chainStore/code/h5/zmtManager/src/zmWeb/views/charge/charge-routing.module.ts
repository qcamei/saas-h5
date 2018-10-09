import {Routes, RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import { ChargeListPage } from "./chargeList/chargeList";
import { AddChargePage } from "./addCharge/addCharge";
import { EditChargePage } from "./editCharge/editCharge";

const mRoutes: Routes = [

  {
    path: 'chargeList',
    component: ChargeListPage,
  },
  {
    path: 'addCharge',
    component: AddChargePage,
  },
  {
    path: 'editCharge/:chargeId',
    component: EditChargePage,
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
export class ChargeRoutingModule {
}
