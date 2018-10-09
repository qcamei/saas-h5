import {Routes, RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {ArrearagesDetailsPage} from "./arrearagesDetails/arrearagesDetails";
import {ArrearagesListPage} from "./arrearagesList/arrearagesList";


const mRoutes:Routes = [
  {
    path:'arrearagesDetails/:leaguerId',
    component:ArrearagesDetailsPage
  },
  {
    path:'arrearagesList',
    component:ArrearagesListPage
  },
]

@NgModule({
  exports: [
    RouterModule
  ],
  imports:[
    RouterModule.forChild(mRoutes),
  ],
})
export class ArrearagesRoutingModule{}
