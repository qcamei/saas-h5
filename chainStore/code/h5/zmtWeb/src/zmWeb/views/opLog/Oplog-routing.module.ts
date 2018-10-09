import {RouterModule, Routes} from "@angular/router";
import {OpLogListPage} from "./opLogList/OpLogList";
import {NgModule} from "@angular/core";


const mRoutes:Routes = [
  {
    path:"oplogList",
    component:OpLogListPage
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

export class OplogRoutingModule{}
