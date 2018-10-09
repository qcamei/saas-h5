import {NgModule} from '@angular/core';
import {AsyncRestProxy} from "./asynDao/AsyncRestProxy";
import {PackageListResolve} from "./guard/listResolve/PackageListResolve";
import {ProductCardListResolve} from "./guard/listResolve/ProductCardListResolve";
import {ProductListResolve} from "./guard/listResolve/ProductListResolve";
import {GoodsListResolve} from "./guard/listResolve/GoodsListResolve";
import {MemberCardListResolve} from "./guard/listResolve/MemberCardListResolve";
import {LeaguerResolve} from "./guard/LeaguerResolve";
import {AppointmentListResolve} from "./guard/listResolve/AppointmentListResolve";


@NgModule({
  declarations: [],
  imports: [
  ],
  providers: [
    AsyncRestProxy,

    LeaguerResolve,

    ProductListResolve,
    GoodsListResolve,
    PackageListResolve,
    ProductCardListResolve,
    MemberCardListResolve,
    AppointmentListResolve,
  ]
})
export class ZmComModule {

}
