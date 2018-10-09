import {NgModule} from '@angular/core';
import {HttpModule} from "@angular/http";
import {AsyncRestProxy} from "./asynDao/AsyncRestProxy";
import {ProductListResolve} from "./guard/listResolve/ProductListResolve";
import {GoodsListResolve} from "./guard/listResolve/GoodsListResolve";
import {PackageListResolve} from "./guard/listResolve/PackageListResolve";
import {ProductCardListResolve} from "./guard/listResolve/ProductCardListResolve";
import {MemberCardListResolve} from "./guard/listResolve/MemberCardListResolve";


@NgModule({
  declarations: [],
  imports: [
    HttpModule
  ],
  providers: [
    AsyncRestProxy,

    ProductListResolve,
    GoodsListResolve,
    PackageListResolve,
    ProductCardListResolve,
    MemberCardListResolve,
  ]
})
export class ZmComModule {

}
