import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { TransactionPage } from './transaction/transaction';
import { ProductStatisticsPage } from './productStatistics/productStatistics';
import { MenberStatisticPage } from './menberStatistic/menberStatistic';
import { CarInfoStatisticPage } from './carInfoStatistic/carInfoStatistic';
import {FinancialStatisticsPage} from "./financialStatistics/financialStatistics";

// const routes: Routes = [
//   {  },
// ];

// export const MyRouteRoutes = RouterModule.forChild(routes);
const mRoutes:Routes = [
  {path:'financial',component:FinancialStatisticsPage},
  {path:'productStatic',component:ProductStatisticsPage},
  {path:'transaction',component:TransactionPage},
  {path:'menberStatic',component:MenberStatisticPage},
  {path:'carInfoStatic',component:CarInfoStatisticPage},
]

@NgModule({
  imports:[
    RouterModule.forChild(mRoutes)
  ],
  exports:[
    RouterModule
  ],
  providers:[]
})

export class ShopStatisticRoutingModule{}
