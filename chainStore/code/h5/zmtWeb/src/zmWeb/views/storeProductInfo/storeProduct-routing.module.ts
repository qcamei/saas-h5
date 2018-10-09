import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {ProductInfoListPage} from "./productInfo/productInfoList/productInfoList";
import {AddProductInfoPage} from "./productInfo/addProductInfo/addProductInfo";
import {EditProductInfoPage} from "./productInfo/editProductInfo/editProductInfo";
import {ProductInfoDetailPage} from "./productInfo/productInfoDetail/productInfoDetail";
import {ProductTypeListPage} from "./productType/productTypeList";
import {ProductListResolve} from "../../comModule/guard/listResolve/ProductListResolve";


const mRoutes: Routes = [

  {
    path: "productInfoList",
    resolve:{todos:ProductListResolve},
    component:ProductInfoListPage,
  },
  {
    path: 'addProductInfo',
    component: AddProductInfoPage,
  },
  {
    path: 'editProductInfo/:productId',
    component: EditProductInfoPage,
  },
  {
    path: 'productInfoDetail/:productDetailId',
    component: ProductInfoDetailPage,
  },
  {
    path: 'productType',
    component: ProductTypeListPage,
  },

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
export class StorePrdRoutingModule {
}
