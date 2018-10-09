import {Routes, RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {BonusListPage} from "./bonusList/bonusList";
import {BonusDetailPage} from "./bonusDetail/bonusDetail";

/**
 * 提成管理路由
 */
const mRoutes:Routes = [
  {
    path:"bonusList",
    component:BonusListPage
  },
  {
    path:"bonusDetail/:buserId",
    component:BonusDetailPage
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

export class BonusRoutingModule{}
