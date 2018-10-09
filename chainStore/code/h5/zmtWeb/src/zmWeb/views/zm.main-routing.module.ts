import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainPage} from "./main/main.page";
import {MainGuard} from "../comModule/guard/MainGuard";
import {MainResolve} from "../comModule/guard/MainResolve";
import {LeaguerResolve} from "../comModule/guard/LeaguerResolve";

const mRoutes: Routes = [
  {
    path: "main",
    canActivateChild:[MainGuard],
    resolve:{todos:MainResolve},
    component: MainPage,
    children:[
      { path:"storeProductInfo",loadChildren:'zmWeb/views/storeProductInfo/storeProduct.module#StoreProductInfoModule'},
      { path:"storeGoods",loadChildren:'zmWeb/views/storeGoods/storeGoods.module#StoreGoodsModule'},
      { path:"storePackageProject",loadChildren:'zmWeb/views/storePackageProject/StorePackageProject.module#StorePackageProjectModule'},
      { path:"storeCardInfo",loadChildren:'zmWeb/views/storeCardInfo/storeCardInfo.module#StoreCardInfoModule'},

      { path:"buser",loadChildren:'zmWeb/views/buser/buser.module#BUserModule'},
      { path:"store",loadChildren:'zmWeb/views/store/store.module#StoreModule'},
      { path:"storeClerkInfo",loadChildren:'zmWeb/views/storeClerkInfo/storeClerkInfo.module#StoreClerkInfoModule'},
      { path:"storeLeaguerInfo",
        resolve:{todos:LeaguerResolve},
        loadChildren:'zmWeb/views/storeLeaguerInfo/storeLeaguerInfo.module#StoreLeaguerInfoModule'
      },
      { path:"storeFlow",loadChildren:'zmWeb/views/storeflow/storeFlow.module#StoreFlowModule'},
      { path:"appointment",loadChildren:'zmWeb/views/appointment/Appointment.module#AppointmentModule'},
      { path:"bonus",loadChildren:'zmWeb/views/bonus/bonus.module#BonusModule'},
      { path:"order",loadChildren:'zmWeb/views/order/order.module#OrderModule'},
      { path:"userCenter",loadChildren:'zmWeb/views/userCenter/userCenter.module#UserCenterModule'},
      { path:"dataReport",loadChildren:'zmWeb/views/dataReport/dataReport.module#DataReportModule'},
      { path:"home",loadChildren:'zmWeb/views/home/home.module#HomeModule'},
      { path:"euser",loadChildren:'zmWeb/views/euser/euser.module#EUserModule'},
      { path:"error",loadChildren:'zmWeb/views/error/error.module#ErrorModule'},
      { path:"operation",loadChildren:'zmWeb/views/operation/operation.module#OperationModule'},
      { path:"guide",loadChildren:'zmWeb/views/guide/guide.module#GuideModule'},
      { path:"buserDevice",loadChildren:'zmWeb/views/buserDevice/buserDevice.module#BUserDeviceModule'},
      { path:"arrearages",loadChildren:'zmWeb/views/arrearages/arrearages.module#ArrearagesModule'},
      { path:"settings",loadChildren:'zmWeb/views/settings/settings.module#SettingsModule'},
      { path:"membershipRecharge",loadChildren:'zmWeb/views/MembershipRecharge/MembershipRecharge.module#MembershipRechargeModule'},
      { path:"bill",loadChildren:'zmWeb/views/bill/bill.module#BillModule'},
      { path:"shopStatistic",loadChildren:'zmWeb/views/shopStatistic/shopStatistic.module#ShopStatisticModule'},
      { path:"pullData",loadChildren:'zmWeb/views/pullData/pullData.module#PullDataModule'},
      { path:"incomePay",loadChildren:'zmWeb/views/incomePay/IncomePay.module#IncomePayModule'},
      { path:"charge",loadChildren:'zmWeb/views/charge/charge.module#ChargeModule'},
      { path:"buserMessage",loadChildren:'zmWeb/views/buserMessage/BuserMessage.module#BuserMessageModule'},
      { path:"oplog",loadChildren:'zmWeb/views/opLog/Oplog.module#OplogModule'},
      { path:"checkDay",loadChildren:'zmWeb/views/checkDay/checkDay.module#CheckDayModule'},
      { path:"shopping",loadChildren:'zmWeb/views/shoppingOrder/shoppingOrder.module#ShoppingOrderModule'},
      { path:"print",loadChildren:'zmWeb/views/printPreview/printPreview.module#PrintPreviewModule'},
      { path:"storeQrcode",loadChildren:'zmWeb/views/storeQrcode/storeQrcode.module#StoreQrcodeModule'},

      { path:"mytest",loadChildren:'zmWeb/views/test/test.module#TestModule'},

    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(mRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
  ]
})
export class ZmMainRoutingModule { }
