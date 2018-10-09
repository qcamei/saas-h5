/**
 * Created by Administrator on 2017/12/17 0017.
 */

import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {UserDetailPage} from "./userDetail/userDetail";
import {ChangePasswordPage} from "./changePassword/changePassword";




const mRoutes:Routes = [
  {
    path: "userDetail",
    component: UserDetailPage
  },
  {
    path: "changePassword",
    component: ChangePasswordPage
  },

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
export class UserCenterRoutingModule { }
