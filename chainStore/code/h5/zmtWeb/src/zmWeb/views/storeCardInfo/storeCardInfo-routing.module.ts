import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AddMemberCardPage} from "./memberCard/addMemberCard/addMemberCard";
import {MemberCardDetailPage} from "./memberCard/memberCardDetail/memberCardDetail";
import {MemberCardListPage} from "./memberCard/memberCardList/memberCardList";
import {ProductCardListPage} from "./productCard/productCardList/productCardList";
import {UpdateMemberCardPage} from "./memberCard/updateMemberCard/updateMemberCard";
import {AddProductCardPage} from "./productCard/addProductCard/addProductCard";
import {ProductCardDetailPage} from "./productCard/productCardDetail/productCardDetail";
import {UpdateProductCardPage} from "./productCard/updateProductCard/updateProductCard";
import {ProductCardTypeListPage} from "./productCard/productCardType/productCardTypeList";
import {ProductCardListResolve} from "../../comModule/guard/listResolve/ProductCardListResolve";
import {MemberCardListResolve} from "../../comModule/guard/listResolve/MemberCardListResolve";


const mRoutes: Routes = [
  {
    path:"memberCard",
    children:[
      {
        path: "list",
        resolve:{todos:MemberCardListResolve},
        component: MemberCardListPage,
      },
      {
        path: "add",
        component: AddMemberCardPage,
      },
      {
        path: "detail/:mbCardId",
        component: MemberCardDetailPage,
      },
      {
        path: "update/:mbCardId",
        component: UpdateMemberCardPage,
      },
    ]
  },
  {
    path:"productCard",
    children:[
      {
        path: "list",
        resolve:{todos:ProductCardListResolve},
        component: ProductCardListPage,
      },
      {
        path: "add",
        component: AddProductCardPage,
      },
      {
        path: "detail/:prdCardId",
        component: ProductCardDetailPage,
      },
      {
        path: "update/:prdCardId",
        component: UpdateProductCardPage,
      },
      {
        path: "typeList",
        component: ProductCardTypeListPage,
      }
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
  providers: []
})
export class StoreCardInfoRoutingModule {
}
