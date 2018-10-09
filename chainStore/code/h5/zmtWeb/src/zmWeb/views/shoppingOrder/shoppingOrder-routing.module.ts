import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import { ShoppingOrderListPage } from "./shoppingOrderList/shoppingOrderList";
import { ShoppingDetailsPage } from "./shoppingDetails/shoppingDetails";


const mRoutes:Routes = [
  {
    path:"shoppingOrder",
    component:ShoppingOrderListPage
  },
  {
    path:"shoppingDetails/:orderId",
    component:ShoppingDetailsPage
  },
]

@NgModule({
  imports:[
    RouterModule.forChild(mRoutes)
  ],
  exports:[
    RouterModule
  ],
  providers:[]
})

export class ShoppingOrderRoutingModule{}
