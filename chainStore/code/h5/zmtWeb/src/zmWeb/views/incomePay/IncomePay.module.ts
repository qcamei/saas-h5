import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SharedModule} from "../common/SharedModule/SharedModule";
import {FormsModule} from "@angular/forms";
import {ZmCompModule} from "../zmComp/zmComp.module";
import {AddIncomePayPage} from "./addIncomPay/AddIncomePay";
import {IncomePayListPage} from "./incomePayList/IncomePayList";
import {EditIncomePayPage} from "./editIncomePay/EditIncomePay";
import {IncomePayRoutingModule} from "./IncomePay-routing.module";
import {IncomePayTypeListPage} from "./incomePayType/IncomePayType";
import {StoreIncomePayViewDataMgr} from "./StoreIncomePayViewDataMgr";
import {StoreIncomePayBsmodule} from "../../bsModule/incomePay/StoreIncomePay.bsmodule";
import {IncomePayTypeComponent} from "./incomePayType/incomePayTypeModule";
import {IncomePayBuserPopup} from "./Comp/incomePayUserPopup/IncomePayUserPopup";


@NgModule({
  declarations:[
    IncomePayListPage,
    IncomePayTypeListPage,
    AddIncomePayPage,
    EditIncomePayPage,
    IncomePayBuserPopup,
    IncomePayTypeComponent,
  ],
  imports:[

    CommonModule, // *ngFor
    FormsModule,  //表单 双向绑定
    //组件module
    SharedModule,
    ZmCompModule,


    //路由
    IncomePayRoutingModule,
    StoreIncomePayBsmodule,
  ],
  providers:[
    StoreIncomePayViewDataMgr,
  ],
  entryComponents: [
    IncomePayTypeComponent,
    IncomePayBuserPopup,
  ]
})


export class IncomePayModule {

}
