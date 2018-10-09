import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../common/SharedModule/SharedModule";
import {ZmCompModule} from "../zmComp/zmComp.module";
import {OpLogBsmodule} from "../../bsModule/opLog/OpLog.bsmodule";
import {NgModule} from "@angular/core";
import { ShoppingOrderRoutingModule } from "./shoppingOrder-routing.module";
import { ShoppingOrderListPage } from "./shoppingOrderList/shoppingOrderList";
import {MatStepperModule} from '@angular/material/stepper';
import { ShipmentsComp } from "./Comp/shipmentsComp/shipmentsComp";
import { ShoppingDetailsPage } from "./shoppingDetails/shoppingDetails";
import {ShoppingOrderViewDataMgr} from "./ShoppingOrderViewDataMgr";
import {OrderBSmodule} from "../../bsModule/order/Order.bsmodule";
import {OrderTrackBSModule} from "../../bsModule/orderTrack/OrderTrack.bsmodule";
import {OrderDetailBSModule} from "../../bsModule/orderDetail/OrderDetail.bsmodule";
import {ChargebackInfoComp} from "../order/Comp/chargebackInfo/chargebackInfo";
import {OrderModule} from "../order/order.module";

@NgModule({
  declarations:[
    //page
    ShoppingDetailsPage,
    ShoppingOrderListPage,
    // 立即发货
    ShipmentsComp,
  ],
  imports:[
    //公共module
    CommonModule,
    FormsModule,
    SharedModule,
    ZmCompModule,

    //业务module
    OrderModule,
    OrderDetailBSModule,
    OrderTrackBSModule,

    MatStepperModule,

    //路由module
    ShoppingOrderRoutingModule
  ],
  exports:[
    //page
  ],
  providers:[
    ShoppingOrderViewDataMgr,
  ],

  entryComponents: [
    ShipmentsComp,
  ],

})

export class ShoppingOrderModule{

}
