
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancialStatisticsPage } from './financialStatistics/financialStatistics';
import { ShopStatisticRoutingModule } from './shopStatistic-routing.module';
import { TransactionPage } from './transaction/transaction';
import { ZmCompModule } from '../zmComp/zmComp.module';
import { SharedModule } from '../common/SharedModule/SharedModule';
import { NgxEchartsModule } from 'ngx-echarts';
import { ProductStatisticsPage } from './productStatistics/productStatistics';
import { MenberStatisticPage } from './menberStatistic/menberStatistic';
import { CarInfoStatisticPage } from './carInfoStatistic/carInfoStatistic';
// import { shopStatisticViewDataMgr} from "./shopStatisticViewDataMgr";
import {ProductStatisticsBsmodule} from "../../bsModule/productStatistics/ProductStatistics.bsmodule";

import {MenberStatisticsBsmodule} from "../../bsModule/memberStatistics/MenberStatistics.bsmodule";

import {CardStatisticsBsmodule} from "../../bsModule/CardStatistics/CardStatistics.bsmodule";
import {DataReportMgr} from "../../bsModule/dataReport/DataReportMgr";
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatMenuModule} from "@angular/material";
import {MatChipsModule} from "@angular/material/chips";
@NgModule({
  imports: [
    CommonModule,
    NgxEchartsModule,
    // zm组件
    ZmCompModule,
    SharedModule,
    // 路由
    ShopStatisticRoutingModule,

    ProductStatisticsBsmodule,
    MenberStatisticsBsmodule,
    CardStatisticsBsmodule,
    FlexLayoutModule,
    MatMenuModule,
    MatChipsModule,
  ],

  declarations: [
      //  StatisticMainPage,
    //   page
    FinancialStatisticsPage,
    TransactionPage,
    ProductStatisticsPage,
    MenberStatisticPage,
    CarInfoStatisticPage,
    // echarts
    // FinancialEchartsComp,
  ],
  providers:[
    DataReportMgr
  ],
  schemas:[

  ]
})
export class ShopStatisticModule {

}
