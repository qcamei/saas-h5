
import {Routes, RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import { BillListPage } from "./billList/billList";
import {BillDetailPage} from "./billDetail/billDetail";

const mRoutes: Routes = [
  {
    path: 'billList',
    component: BillListPage
  },
  {
    path: 'billDetail/:workFlowId',
    component: BillDetailPage
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
export class BillRoutingModule {
}
