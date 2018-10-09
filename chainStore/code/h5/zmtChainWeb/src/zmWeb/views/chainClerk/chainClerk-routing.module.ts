import {Routes, RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {ManageRolePage} from "./manageRole/manageRole";
import {EditAdminRolePage} from "./editAdminRole/editAdminRole";
import {AddAdminRolePage} from "./addAdminRole/addAdminRole";
import {AllocationRolePage} from "./allocationRole/allocationRole";
import {FindClerkPage} from "./findClerk/findClerk";

/**
 * 用户管理路由
 */
const mRoutes:Routes = [
  {path:'findClerk',component:FindClerkPage},
  {path:'manageRole',component:ManageRolePage},
  {path:'editAdminRole/:roleId',component:EditAdminRolePage},
  {path:'addAdminRole',component:AddAdminRolePage},
  {path:'allocationRole/:clerkId',component:AllocationRolePage},


];

@NgModule({
  imports:[
    RouterModule.forChild(mRoutes)
  ],
  exports:[
    RouterModule
  ],
  providers:[]
})

export class ChainClerkRoutingModule{}
