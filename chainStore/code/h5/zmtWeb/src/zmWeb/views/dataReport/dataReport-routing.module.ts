import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {ConsumeReportPage} from "./consumeReport/consumeReport";
import {LeaguerReportPage} from "./leaguerReport/leaguerReport";

const mRoutes: Routes = [
  {
    path: "leaguerReport",
    component: LeaguerReportPage
  },
  {
    path: "consumeReport",
    component: ConsumeReportPage
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
export class DataReportRoutingModule {
}
