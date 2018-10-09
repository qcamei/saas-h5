
import {AddEUserPage} from "./addEUser/addEUser";
import {Routes, RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";


const mRoutes: Routes = [
  {
    path: 'addEUser',
    component: AddEUserPage,
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
export class EUserRoutingModule {
}
