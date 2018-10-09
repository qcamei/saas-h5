import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainPage} from "./main/page/main.page";
import {MainGuard} from "../comModule/guard/MainGuard";
import {MainResolve} from "../comModule/guard/MainResolve";


const mRoutes: Routes = [
  {
    path: "main",
    canActivateChild:[MainGuard],
    resolve:{todos:MainResolve},
    component: MainPage,
    children:[

      { path:"chain",loadChildren:'zmWeb/views/chain/Chain.module#ChainModule'},
      { path:"chainUser",loadChildren:'zmWeb/views/chainUser/ChainUser.module#ChainUserModule'},
      { path:"chainClerk",loadChildren:'zmWeb/views/chainClerk/chainClerk.module#ChainClerkModule'},
      { path:"chainProduct",loadChildren:'zmWeb/views/chainProduct/chainProduct.module#ChainProductModule'},
      { path:"chainGoods",loadChildren:'zmWeb/views/chainGoods/chainGoods.module#ChainGoodsModule'},
      { path:"chainPackageProject",loadChildren:'zmWeb/views/chainPackageProject/chainPackageProject.module#ChainPackageProjectModule'},
      { path:"chainCard",loadChildren:'zmWeb/views/chainCard/chainCard.module#ChainCardModule'},
      { path:"productionLibrary",loadChildren:'zmWeb/views/productionLibrary/productionLibrary.module#ProductionLibraryModule'},
      { path:"userCenter",loadChildren:'zmWeb/views/userCenter/userCenter.module#UserCenterModule'},
      { path:"home",loadChildren:'zmWeb/views/home/home.module#HomeModule'},
      { path:"dataReport",loadChildren:'zmWeb/views/dataReport/data-report.module#DataReportModule'},
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
