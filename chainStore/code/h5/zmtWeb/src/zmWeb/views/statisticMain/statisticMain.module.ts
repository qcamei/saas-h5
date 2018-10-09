import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {ZmCompModule} from "../zmComp/zmComp.module";
import {SharedModule} from "../common/SharedModule/SharedModule";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import { StatisticMainPage } from './statisticMain';

// import { StatisticMainPage } from './statisticMain';

@NgModule({
  imports: [
    CommonModule,
  // zm组件
    ZmCompModule,
    SharedModule,
    FormsModule,
    RouterModule,
    // 路由
  ],
  declarations: [
    StatisticMainPage
    ],
  exports: [
     StatisticMainPage
    
      ],
})
export class StatisticMainModule{ }
