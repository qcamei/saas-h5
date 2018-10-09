import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {BuserMessageListPage} from "./buserMessageList/BuserMessageList";


const mRoutes:Routes = [
  {
    path:"buserMessageList",
    component:BuserMessageListPage,
  }
];

@NgModule({
  imports:[
    RouterModule.forChild(mRoutes),
  ],
  exports:[
    RouterModule
  ]
})
export class BuserMessageRoutingModule{}
