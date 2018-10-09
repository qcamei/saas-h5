import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {OrderViewDataMgr} from "./orderViewDataMgr";
import {NgModule} from "@angular/core";
import {OrderRoutingModule} from "./order-routing.module";
import {OrderListPage} from "./orderList/orderList";
import {EditConsumeBonusPage} from "./editConsumeBonus/editConsumeBonus";
import {EditRechargeBonusPage} from "./editRechargeBonus/editRechargeBonus";
import {OrderRechargeDetailPage} from "./orderRechargeDetail/orderRechargeDetail";
import {OrderBSmodule} from "../../bsModule/order/Order.bsmodule";
import {BonusRecordBSmodule} from "../../bsModule/bonusRecord/BonusRecord.bsmodule";
import {StoreClerkInfoBSmodule} from "../../bsModule/storeClerkInfo/StoreClerkInfo.bsmodule";
import {BUserBSModule} from "../../bsModule/buser/BUser.bsModule";
import {StoreLeaguerInfoBSmodule} from "../../bsModule/storeLeaguerInfo/StoreLeaguerInfo.bsmodule";
import {OrderLeaguerNamePipe} from "./pipe/orderLeaguerNamePipe";
import {SharedModule} from "../common/SharedModule/SharedModule";
import {OrderLimitUnitPipe} from "./pipe/OrderLimitUnitPipe";
import {ZmCompModule} from "../zmComp/zmComp.module";
import {LeaguerDetailBSmodule} from "../../bsModule/leaguerDetail/LeaguerDetail.bsmodule";
import {OrderDetailBSModule} from "../../bsModule/orderDetail/OrderDetail.bsmodule";
import {OrderConsumeDetailPage} from "./orderConsumeDetail/orderConsumeDetail";
import {OrderTypePipe} from "./pipe/OrderTypePipe";
import {BonusTypePipe} from "./pipe/BonusTypePipe";
import {ChargebackReasonComp} from "./Comp/chargebackReason/chargebackReason";
import {OrderNotesBSModule} from "../../bsModule/orderNotes/OrderNotes.bsModule";
import { AddOrderRecordPage } from "./addRecord/addOrderRecord";
import {ChargeBackPayTypePipe} from "./pipe/ChargeBackPayTypePipe";
import {ChargebackInfoComp} from "./Comp/chargebackInfo/chargebackInfo";
import {OrderConsumeDetailComp} from "./orderConsumeDetail/orderConsumeDetailComp";
import {EditConsumeBonusComp} from "./editConsumeBonus/editConsumeBonusComp";
import {PayComp} from "./pay/payComp/payComp";
import {ScanPayComp} from "./pay/scanPayComp/scanPayComp";
import {BScanComp} from "./pay/scanPayComp/beScanComp";
import {ScanComp} from "./pay/scanPayComp/scanComp";
import {UnPayPopup} from "./pay/unPayPopup";
import {ConsumePayGuard} from "./pay/consumePayGuard";
import {RechargePayGuard} from "./pay/rechargePayGuard";
import {ConsumePayPage} from "./pay/consumePay";
import {RechargePayPage} from "./pay/rechargePay";
import {PaySucceedPopup} from "./pay/paySucceedPopup/paySucceedPopup";
import {StoreLeaguerInfoModule} from "../storeLeaguerInfo/storeLeaguerInfo.module";
import {StoreFlowModule} from "../storeflow/storeFlow.module";

@NgModule({
  declarations:[
    //page
    OrderListPage,
    EditConsumeBonusPage,
    EditRechargeBonusPage,
    OrderConsumeDetailPage,
    OrderRechargeDetailPage,
    AddOrderRecordPage,
    ConsumePayPage,
    RechargePayPage,

    //pipe
    OrderLeaguerNamePipe,
    OrderLimitUnitPipe,
    OrderTypePipe,
    BonusTypePipe,
    ChargeBackPayTypePipe,
    //comp
    ChargebackInfoComp,//退单
    OrderConsumeDetailComp,//订单详情
    EditConsumeBonusComp,//修改订单提成
    PayComp,//支付组件
    PaySucceedPopup,  //支付成功弹框
    ScanPayComp,
    BScanComp,
    ScanComp,
    UnPayPopup,//未收款弹框

    ChargebackReasonComp,

],
  imports:[
    //公共module
    CommonModule,
    FormsModule,
    SharedModule,
    ZmCompModule,

    //业务module
    OrderBSmodule,
    BonusRecordBSmodule,
    StoreClerkInfoBSmodule,
    BUserBSModule,
    StoreLeaguerInfoBSmodule,
    LeaguerDetailBSmodule,
    OrderDetailBSModule,
    OrderNotesBSModule,

    //page
    StoreLeaguerInfoModule,
    StoreFlowModule,

    //路由module
    OrderRoutingModule,

  ],
  exports:[
    //page
    OrderListPage
  ],
  providers:[
    OrderViewDataMgr,
    ConsumePayGuard,
    RechargePayGuard,
  ],

  entryComponents: [
    ChargebackInfoComp,
    ChargebackReasonComp,//退单
    OrderConsumeDetailComp,//订单详情
    EditConsumeBonusComp,//修改订单提成

    ScanPayComp,
    BScanComp,
    ScanComp,
    UnPayPopup,//未收款弹框
    PaySucceedPopup,
  ],

})

export class OrderModule{}
