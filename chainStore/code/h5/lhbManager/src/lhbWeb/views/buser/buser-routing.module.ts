import {Routes, RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {BUserListPage} from "./page/buserList";


const mRoutes: Routes = [

  { path:"buserList",
    component:BUserListPage,
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
