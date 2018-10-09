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
      { path:"buser",loadChildren:'lhbWeb/views/buser/buser.module#BUserModule'},
      { path:"buserCheck",loadChildren:'lhbWeb/views/buserCheck/buserCheck.module#BUserCheckModule'},
      { path:"home",loadChildren:'lhbWeb/views/home/home.module#HomeModule'},

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
