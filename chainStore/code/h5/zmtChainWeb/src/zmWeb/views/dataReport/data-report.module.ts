import {NgxEchartsModule} from "ngx-echarts";
import {CommonModule} from "@angular/common";
import {SharedModule} from "../common/SharedModule/SharedModule";
import {ZmCompModule} from "../zmComp/zmComp.module";
import {NgModule} from "@angular/core";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatCard, MatCardModule, MatChipsModule, MatMenuModule} from "@angular/material";
import {DataReportRoutingModule} from "./data-report.routing.module";
import {StoreStatisticsComponent} from "./storeStatictis/store-statistics.component";
import {DataReportMgr} from "../../bsModule/dataReport/DataReportMgr";
import {StoreStatisticsViewDataMgr} from "./storeStatictis/store-statistics-view-data.mgr";
import {ShopModelComponent} from "./shopModel/shop-model.component";
import {FinanceReportComponent} from "./financeReport/finance-report.component";
import {CardStatisticComponent} from "./cardStatistics/card-statistic.component";
import {CardStatisticsBsmodule} from "../../bsModule/dataReport/CardStatistics/CardStatistics.bsmodule";
import {MemberStatisticsComponent} from "./menberStatistic/member-statistics.component";
import {MemberStatisticsBsmodule} from "../../bsModule/dataReport/memberStatistics/MemberStatistics.bsmodule";
import {ProductStatisticsBsmodule} from "../../bsModule/dataReport/productStatistics/ProductStatistics.bsmodule";
import {ProductStatisticsComponent} from "./productStatistics/product-statistics.component";
import {TransactionFlowComponent} from "./transaction/transaction-flow.component";
import {StoreConfigBsModule} from "../../bsModule/storeConfig/store-config-bs.module";

@NgModule({
  imports: [
    CommonModule,
    NgxEchartsModule,
    // zm组件
    ZmCompModule,
    SharedModule,
    DataReportRoutingModule,
    // FlexLayoutModule,
    MatMenuModule,
    MatChipsModule,
    CardStatisticsBsmodule,
    MemberStatisticsBsmodule,
    ProductStatisticsBsmodule,
    StoreConfigBsModule,
    MatCardModule
  ],

  declarations: [
    ShopModelComponent,
    CardStatisticComponent,
    FinanceReportComponent,
    MemberStatisticsComponent,
    ProductStatisticsComponent,
    StoreStatisticsComponent,
    TransactionFlowComponent
  ],
  providers: [
    DataReportMgr,
    StoreStatisticsViewDataMgr
  ],
  entryComponents:[
    ShopModelComponent
  ],
  schemas: []
})
export class DataReportModule {

}
