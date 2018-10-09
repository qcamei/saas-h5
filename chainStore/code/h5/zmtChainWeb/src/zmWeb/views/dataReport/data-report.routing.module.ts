import {RouterModule, Routes} from "@angular/router";
import {StoreStatisticsComponent} from "./storeStatictis/store-statistics.component";
import {NgModule} from "@angular/core";
import {FinanceReportComponent} from "./financeReport/finance-report.component";
import {CardStatisticComponent} from "./cardStatistics/card-statistic.component";
import {MemberStatisticsComponent} from "./menberStatistic/member-statistics.component";
import {ProductStatisticsComponent} from "./productStatistics/product-statistics.component";
import {TransactionFlowComponent} from "./transaction/transaction-flow.component";

const mRoutes:Routes = [
  {path:'storeStatistics',component:StoreStatisticsComponent},
  {path:'financeReport',component:FinanceReportComponent},
  {path:'cardStatistic',component:CardStatisticComponent},
  {path:'memberStatistics',component:MemberStatisticsComponent},
  {path:'productStatistics',component:ProductStatisticsComponent},
  {path:'transactionFlow',component:TransactionFlowComponent},
];

@NgModule({
  imports:[
    RouterModule.forChild(mRoutes)
  ],
  exports:[
    RouterModule
  ],
  providers:[]
})
export class DataReportRoutingModule {

}
