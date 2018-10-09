import {RegPage} from "./reg/reg";
import {Routes, RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {ResetPwdPage} from "./resetPwd/resetPwd";
import {SelectivePage} from "./selective/selective";
import {BUserListPage} from "./buserList/buserList";
import {BUserEditPage} from "./buserEdit/buserEdit";


const mRoutes: Routes = [
  {
    path: 'selective',
    component: SelectivePage,
  },
  {
    path: 'reg/:roleSet',
    component: RegPage,
  },
  {
    path: 'resetPwd',
    component: ResetPwdPage,
  },
  {
    path: 'buserList/:phone',
    component: BUserListPage,
  },
  {
    path: 'buserEdit',
    component: BUserEditPage,
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
