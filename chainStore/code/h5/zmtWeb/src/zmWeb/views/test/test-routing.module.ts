/**
 * Created by Administrator on 2017/12/17 0017.
 */

import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {TestPage} from "./test";




const mRoutes:Routes = [
  {
    path: "test",
    component: TestPage
  }

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
export class TestRoutingModule { }
