
import {OperationPage} from "./operation/operation";
import {Routes, RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";

const mRoutes: Routes = [
  {
    path: 'operation',
    component: OperationPage,
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
export class OperationRoutingModule {
}
