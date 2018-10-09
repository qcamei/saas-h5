
import {Routes, RouterModule} from "@angular/router";
import {VipLevelListPage} from "./vipLevelList/vipLevelList";
import {NgModule} from "@angular/core";
import {AddVipLevelPage} from "./addVipLevel/addVipLevel";
import {EditVipLevelPage} from "./editVipLevel/editVipLevel";
const mRoutes: Routes = [

  {
    path: 'vipLevelList',
    component: VipLevelListPage,
  },
  {
    path: 'addVipLevel',
    component: AddVipLevelPage,
  },
  {
    path: 'editVipLevel/:id',
    component: EditVipLevelPage,
  },

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
export class VipLevelRoutingModule {
}
