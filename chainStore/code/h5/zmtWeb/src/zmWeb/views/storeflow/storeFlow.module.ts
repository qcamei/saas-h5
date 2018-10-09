import {NgModule} from "@angular/core";
import {CommonModule, DatePipe} from '@angular/common';
import {FormsModule} from "@angular/forms";
import { RechargePage} from './storeRecharge/recharge';
import {StoreFlowRoutingModule} from "./storeFlow-routing.module";
import {ConsumePage} from "./storeConsume/consume";
import {SharedModule} from "../common/SharedModule/SharedModule";
import {StoreLeaguerInfoBSmodule} from "../../bsModule/storeLeaguerInfo/StoreLeaguerInfo.bsmodule";
import {SelectStaffComp} from "./selectStaffComp/selectStaffComp";
import {SelectProductPopupComp} from "./selectProductComp/selectProductPopup/selectProductPopupComp";
import {SelectGoodsPopupComp} from "./selectGoodsComp/selectGoodsPopup/selectGoodsPopupComp";
import {BonusComp} from "./bonusComp/bonusComp";
import {OrderComp} from "./orderComp/orderComp";
import {BillComp} from "./billComp/billComp";
import {StoreLeaguerInfoViewDataMgr} from "../storeLeaguerInfo/StoreLeaguerInfoViewDataMgr";
import {StoreCardInfoBSModule} from "../../bsModule/storeCardInfo/StoreCardInfo.bsmodule";
import {RechargeViewDataMgr} from "./RechargeViewDataMgr";
import {WorkFlowBSmodule} from "../../bsModule/workFlow/WorkFlow.bsmodule";
import {SettleAccountModalComp} from './storeRecharge/settleAccountModalComp/settleAccountModalComp';
import {StoreGoodsBSModule} from "../../bsModule/storeGoods/StoreGoods.bsModule";
import {StoreClerkInfoBSmodule} from "../../bsModule/storeClerkInfo/StoreClerkInfo.bsmodule";
import {BUserBSModule} from "../../bsModule/buser/BUser.bsModule";
import {WorkFlowTypeBSmodule} from "../../bsModule/workFlowType/WorkFlowType.bsmodule";
import {OrderBSmodule} from "../../bsModule/order/Order.bsmodule";
import {paymentSuccessModalComp} from "./storeRecharge/paymentSuccessModalComp/paymentSuccessModalComp";
import {RechargeSettingComp} from './storeRecharge/rechargeSettingComp/rechargeSettingComp';
import {SelectCardPopupComp} from "./selectCardComp/selectCardPopup/selectCardPopupComp";
import {SettleAccountModuleComp} from "./storeRecharge/settleAccountModuleComp/settleAccountModuleComp";
import {BonusPopupComp} from "./bonusComp/bonusPopup/bonusPopup";
import {OrderPopup} from "./orderComp/orderPopup/orderPopup";
import {WFDataWraperMgr} from "./wfComp/WFDataWraperMgr";
import {StoreBSmodule} from "../../bsModule/store/Store.bsmodule";
import {CuserWFComp} from "./CuserWFComp/CuserWFComp";
import {CuserWFPopup} from "./CuserWFComp/CuserWFPopup/CuserWFPopup";
import {BuserWFComp} from "./BuserWFComp/BuserWFComp";
import {BuserWFPopup} from "./BuserWFComp/BuserWFPopup/BuserWFPopup";
import {SelectMemberCardPopup} from "./storeRecharge/rechargeSettingComp/selectMemberCardPopup";
import {ZmCompModule} from "../zmComp/zmComp.module";
import {LeaguerDetailBSmodule} from "../../bsModule/leaguerDetail/LeaguerDetail.bsmodule";
import {StoreProductInfoBSModule} from "../../bsModule/StoreProductInfo/StoreProductInfo.bsModule";
import {ConsumeUnsettledGuard} from "./consumeUnsettledGuard";
import {RechargeUnsettledGuard} from "./rechargeUnsettledGuard";
import {SelectReduceCardComp} from "./selectReduceCardComp/selectReduceCardComp";
import {SelectReduceCardPopup} from "./selectReduceCardComp/selectReduceCardPopup/selectReduceCardPopupComp";
import {SelectConsumeComp} from "./selectConsumeComp/selectConsumeComp";
import {ProductCardDetailBSmodule} from "../../bsModule/productCardDetail/productCardDetail.bsmodule";
import {StorePackageProjectBSModule} from "../../bsModule/storePackageProject/StorePackageProject.bsModule";
import {OrderNewPopup} from "./orderComp/orderPopup/orderNewPopup";
import {SelectPackagePopupComp} from "./selectPackageComp/selectPackagePopupComp";
import { ConsumeSavePopup } from "./consumeSavePopup";
import {ConsumeComp} from "./storeConsume/consumeComp";
import {PayBSmodule} from "../../bsModule/pay/Pay.bsmodule";
import {MatChipsModule} from "@angular/material/chips";

@NgModule({
  declarations:[
    RechargePage,
    ConsumePage,
    CuserWFComp,//选择会员
    BuserWFComp,
    SelectStaffComp,
    SelectReduceCardComp,
    SelectConsumeComp,
    ConsumeComp,//开单组件

    //弹窗
    CuserWFPopup,
    BuserWFPopup,
    SelectProductPopupComp,
    SelectGoodsPopupComp,
    SelectCardPopupComp,
    BonusPopupComp,
    OrderPopup,
    SelectReduceCardPopup,
    OrderNewPopup,
    SelectPackagePopupComp,
    ConsumeSavePopup,

    BonusComp,
    OrderComp,
    BillComp,
    //结算单
    SettleAccountModalComp,
    paymentSuccessModalComp,

    //充值设置
    RechargeSettingComp,
    SettleAccountModuleComp,
    //设置会员卡
    SelectMemberCardPopup,
  ],
  imports:[
    CommonModule,// *ngFor
    FormsModule, //表单 双向绑定
    SharedModule,
    //zm公共组件
    ZmCompModule,
    MatChipsModule,
    //业务模块bsModule
    WorkFlowBSmodule,
    WorkFlowTypeBSmodule,
    StoreLeaguerInfoBSmodule,
    StoreCardInfoBSModule,
    StoreProductInfoBSModule,
    StoreGoodsBSModule,
    StoreClerkInfoBSmodule,
    BUserBSModule,
    OrderBSmodule,
    StoreBSmodule,
    LeaguerDetailBSmodule,
    ProductCardDetailBSmodule,
    StorePackageProjectBSModule,
    PayBSmodule,
    //路由
    StoreFlowRoutingModule,

  ],
  providers:[
    StoreLeaguerInfoViewDataMgr,
    RechargeViewDataMgr,
    WFDataWraperMgr,
    DatePipe,
    //guard
    ConsumeUnsettledGuard,
    RechargeUnsettledGuard,
  ],
  exports:[
    //组件
    SelectStaffComp,

  ],
  entryComponents: [
    // 结算单
    SettleAccountModalComp,
    paymentSuccessModalComp,
    BillComp,
    //服务人员
    SelectStaffComp,
    //弹窗
    CuserWFPopup,
    BuserWFPopup,
    SelectProductPopupComp,
    SelectGoodsPopupComp,
    BonusPopupComp,
    OrderPopup,
    OrderNewPopup,
    SelectPackagePopupComp,
    SelectReduceCardPopup,
    SelectCardPopupComp,
    //设置会员卡
    SelectMemberCardPopup,
    //page
    ConsumeComp,//开单组件
  ],

})
export class StoreFlowModule{}
