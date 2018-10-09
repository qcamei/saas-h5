import {Routes, RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {HomePage} from "./page/home";
/**
 * 首页管理路由
 */
const mRoutes: Routes = [
  {
    path: "home",
    component: HomePage,
  },

]

@NgModule({
  imports: [
    RouterModule.forChild(mRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: []
})

export class HomeRoutingModule {
}
