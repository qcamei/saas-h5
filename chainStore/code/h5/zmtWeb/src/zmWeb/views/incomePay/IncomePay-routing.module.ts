/**
 * Created by Administrator on 2017/12/17 0017.
 */

import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {IncomePayListPage} from "./incomePayList/IncomePayList";
import {AddIncomePayPage} from "./addIncomPay/AddIncomePay";
import {IncomePayTypeListPage} from "./incomePayType/IncomePayType";
import {EditIncomePayPage} from "./editIncomePay/EditIncomePay";




const mRoutes:Routes = [
  {
    path: "incomePayList",
    component: IncomePayListPage
  },
  {
    path: "incomePayType",
    component: IncomePayTypeListPage
  },
  {
    path:"addIncomePay/:category",
    component:AddIncomePayPage
  },
  {
    path:"editIncomePay/:incomePayId",
    component:EditIncomePayPage
  }
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

export class IncomePayRoutingModule {

}
