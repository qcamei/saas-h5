
import {ExpiredPage} from "./expired/expired";
import {Routes, RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {ExpiredGuard} from "./expired/ExpiredGuard";

const mRoutes: Routes = [
  {
    path: 'expired',
    component: ExpiredPage,
    canDeactivate: [ ExpiredGuard ]
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
export class ErrorRoutingModule {
}
