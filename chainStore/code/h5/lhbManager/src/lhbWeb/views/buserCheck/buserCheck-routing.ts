import {Routes, RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {BUserCheckListPage} from "./page/buserCheckList";


const mRoutes: Routes = [

  { path:"buserCheckList",
    component:BUserCheckListPage,
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
export class BUserCheckRoutingModule {
}
