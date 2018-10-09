import {Routes, RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {FindLeaguerPage} from "./findLeaguer/findLeaguer";
import {AddLeaguerPage} from "./addLeaguer/addLeaguer";
import {EditLeaguerPage} from "./editLeaguer/editLeaguer";
import {LeaguerDetailPage} from "./leaguerDetail/leaguerDetail";
import {AddRecordPage} from "./leaguerDetail/addRecord/addRecord";
import {EditRecordPage} from "./leaguerDetail/editRecord/editRecord";
import {RecordDetailPage} from "./leaguerDetail/recordDetail/recordDetail";
import {LeaguerAnalysisPage} from "./leaguerAnalysis/leaguerAnalysis";

/**
 * 会员管理路由
 */
const mRoutes:Routes = [
  {
    path:"findLeaguer",
    component:FindLeaguerPage
  },
  {
    path:"addLeaguer/:fromFlag",
    component:AddLeaguerPage
  },
  {
    path:"editLeaguer/:leaguerId",
    component:EditLeaguerPage
  },
  {
    path:"leaguerDetail/:leaguerId",
    component:LeaguerDetailPage
  },
  {
    path:"addRecord/:leaguerId",
    component:AddRecordPage
  },
  {
    path:"editRecord/:leaguerRecordId",
    component:EditRecordPage
  },
  {
    path:"recordDetail/:leaguerRecordId",
    component:RecordDetailPage
  },
  {
    path:"leaguerAnalysis",
    component:LeaguerAnalysisPage
  }



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

export class StoreLeaguerInfoRoutingModule{}
