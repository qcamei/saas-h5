import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import { CheckDayListPage } from "./checkDayList/checkDayList";
import { checkDayHandPage } from "./checkDayHand/checkDayHand";
import { CheckDayHandDetailPage } from "./checkDayHandDetail/checkDayHandDetail";


const mRoutes:Routes = [
  {
    path:"checkDayList",
    component:CheckDayListPage
  },
  {
    path:"checkDayHand",
    component:checkDayHandPage
  },
  {
    path:"checkDayHandDetail/:checkDayId",
    component:CheckDayHandDetailPage
  },
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

export class CheckDayRoutingModule{}
