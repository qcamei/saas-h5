import {Routes, RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";


const mRoutes: Routes = [
  // {
  //   path: 'selective',
  //   component: SelectivePage,
  // },
  // {
  //   path: 'reg/:roleSet',
  //   component: RegPage,
  // },
  // {
  //   path: 'resetPwd',
  //   component: ResetPwdPage,
  // }
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
export class MUserRoutingModule {
}
