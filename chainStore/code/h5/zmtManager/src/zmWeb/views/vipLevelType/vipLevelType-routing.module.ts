
import {Routes, RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {VipLevelTypeListPage} from "./list";

const mRoutes: Routes = [

  {
    path: 'vipLevelTypeList',
    component: VipLevelTypeListPage,
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
export class VipLevelTypeRoutingModule {
}
