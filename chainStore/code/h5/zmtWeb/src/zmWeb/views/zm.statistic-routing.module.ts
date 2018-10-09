import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatisticMainPage } from './statisticMain/statisticMain';

const mRoutes: Routes = [
  {
    path: "statisMain",
    // canActivateChild:[MainGuard],
    // resolve:{todos:MainResolve},
    component: StatisticMainPage,
    children:[

      { path:"phoneStatistic",loadChildren:'zmWeb/views/shopStatistic/shopStatistic.module#ShopStatisticModule'},

    ]
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
export class ZmStatisticRoutingModule{ }
