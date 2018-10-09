import {RegPage} from "./reg/reg";
import {Routes, RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {ResetPwdPage} from "./resetPwd/resetPwd";


const mRoutes: Routes = [
  {
    path: 'reg',
    component: RegPage,
  },
  {
    path: 'resetPwd',
    component: ResetPwdPage,
  }
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
export class BUserRoutingModule {
}
