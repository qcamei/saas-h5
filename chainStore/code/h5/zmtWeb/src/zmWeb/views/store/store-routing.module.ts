import {Routes, RouterModule} from "@angular/router";
import {FindStorePage} from "./findStore/findStore";
import {NgModule} from "@angular/core";
import {AddStorePage} from "./addStore/addStore";
import {EditStorePage} from "./editStore/editStore";
import {StoreDetailPage} from "./storeDetail/storeDetail";
import {BossAddStorePage} from "./bossAddStore/bossAddStore";
import {ClerkApplyStorePage} from "./clerkApplyStore/clerkApplyStore";
import {ApplyStorePage} from "./applyStore/applyStore";

/**
 * 店铺管理路由
 */
const mRoutes:Routes = [
  {
    path:"findStore",
    component:FindStorePage
  },
  {
    path:"addStore",
    component:AddStorePage
  },
  {
    path:"editStore/:storeId",
    component:EditStorePage
  },
  {
    path:"storeDetail/:storeId",
    component:StoreDetailPage
  },
  {
    path:"bossAddStore",
    component:BossAddStorePage
  },
  {
    path:"clerkApplyStore",
    component:ClerkApplyStorePage
  },
  {
    path:"applyStore",
    component:ApplyStorePage
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

export class StoreRoutingModule{}
