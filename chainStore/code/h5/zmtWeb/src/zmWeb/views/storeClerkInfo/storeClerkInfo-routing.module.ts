import {Routes, RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {FindClerkPage} from "./findClerk/findClerk";
import {AddClerkPage} from "./addClerk/addClerk";
import {AllocationRolePage} from "./allocationRole/allocationRole";
import {AddAdminRolePage} from "./addAdminRole/addAdminRole";
import {EditAdminRolePage} from "./editAdminRole/editAdminRole";
import {ManageRolePage} from "./manageRole/manageRole";

/**
 * 店铺管理路由
 */
const mRoutes:Routes = [
  {
    path:"findClerk/:tabIndex",//tabIndex跳转对应的tab页签
    component:FindClerkPage
  },
  {
    path:"addClerk",
    component:AddClerkPage
  },
  {
    path:"allocationRole/:clerkId",
    component:AllocationRolePage
  },
  {
    path:"manageRole",
    component:ManageRolePage
  },
  {
    path:"addAdminRole",
    component:AddAdminRolePage
  },
  {
    path:"editAdminRole/:roleId",
    component:EditAdminRolePage
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

export class StoreClerkInfoRoutingModule{}
