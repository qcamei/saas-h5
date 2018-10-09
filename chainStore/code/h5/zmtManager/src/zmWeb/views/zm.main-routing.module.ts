import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainPage} from "./main/main.page";
import {MainGuard} from "../comModule/MainGuard";


const mRoutes: Routes = [
  {
    path: "main",
    canActivateChild:[MainGuard],
    component: MainPage,
    children:[

      //仪器管理
      { path:"mngDevice",loadChildren:'zmWeb/views/mngDevice/mngDevice.module#MngDeviceModule'},
      //账号管理
      { path:"buser",loadChildren:'zmWeb/views/buser/buser.module#BUserModule'},
      { path:"vipLevel",loadChildren:'zmWeb/views/vipLevel/vipLevel.module#VipLevelModule'},
      { path:"vipLevelType",loadChildren:'zmWeb/views/vipLevelType/vipLevelType.module#VipLevelTypeModule'},
      //收费管理
      { path:"charge",loadChildren:'zmWeb/views/charge/charge.module#ChargeModule'},
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
