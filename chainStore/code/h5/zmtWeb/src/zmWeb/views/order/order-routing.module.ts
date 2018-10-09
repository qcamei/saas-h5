import {Routes, RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {OrderListPage} from "./orderList/orderList";
import {EditConsumeBonusPage} from "./editConsumeBonus/editConsumeBonus";
import {EditRechargeBonusPage} from "./editRechargeBonus/editRechargeBonus";
import {OrderRechargeDetailPage} from "./orderRechargeDetail/orderRechargeDetail";
import {OrderConsumeDetailPage} from "./orderConsumeDetail/orderConsumeDetail";
import { AddOrderRecordPage } from "./addRecord/addOrderRecord";
import {ConsumePayPage} from "./pay/consumePay";
import {ConsumePayGuard} from "./pay/consumePayGuard";
import {RechargePayPage} from "./pay/rechargePay";
import {RechargePayGuard} from "./pay/rechargePayGuard";

/**
 * 订单管理路由
 */
const mRoutes:Routes = [
  {
    path:"orderList",
    component:OrderListPage
  },
  {
    path:"editConsumeBonus/:orderId",
    component:EditConsumeBonusPage
  },
  {
    path:"editRechargeBonus/:orderId",
    component:EditRechargeBonusPage
  },
  {
    path:"orderConsumeDetail/:orderId",
    component:OrderConsumeDetailPage
  },
  {
    path:"orderRechargeDetail/:orderId",
    component:OrderRechargeDetailPage
  },
  {
    path:"addRecord",
    component: AddOrderRecordPage
  },
  {
    path:"consumePay/:orderId",
    component:ConsumePayPage,
    canDeactivate:[ConsumePayGuard]
  },
  {
    path:"rechargePay/:orderId",
    component:RechargePayPage,
    canDeactivate:[RechargePayGuard]
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

export class OrderRoutingModule{}
