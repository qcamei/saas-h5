import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {BUserModule} from "../buser/buser.module";
import {StorePrdRoutingModule} from "./storeProduct-routing.module";
import {SharedModule} from "./../common/SharedModule/SharedModule";
import {ZmCompModule} from "../zmComp/zmComp.module";
import {StoreCardInfoBSModule} from "../../bsModule/storeCardInfo/StoreCardInfo.bsmodule";
import {ProductInfoListPage} from "./productInfo/productInfoList/productInfoList";
import {EditProductInfoPage} from "./productInfo/editProductInfo/editProductInfo";
import {AddProductInfoPage} from "./productInfo/addProductInfo/addProductInfo";
import {ProductInfoDetailPage} from "./productInfo/productInfoDetail/productInfoDetail";
import {StoreProductInfoBSModule} from "../../bsModule/StoreProductInfo/StoreProductInfo.bsModule";
import {StoreProductInfoViewDataMgr} from "./storeProductViewDataMgr";
import {LeaguerDetailBSmodule} from "../../bsModule/leaguerDetail/LeaguerDetail.bsmodule";
import {ProductTypeListPage} from "./productType/productTypeList";
import {AddOrEditTypeModal} from "./productType/addProductTypeModal";
import {ProductDetailBSModule} from "../../bsModule/productDetail/ProductDetail.bsModule";
import {AddProductTypeWithReturnComp} from "./productInfo/comp/addProductTypeWithReturn";

@NgModule({
  declarations: [
    AddOrEditTypeModal,
    AddProductTypeWithReturnComp,
    //page
    ProductInfoListPage,
    EditProductInfoPage,
    AddProductInfoPage,
    ProductInfoDetailPage,
    ProductTypeListPage,

  ],
  imports: [
    CommonModule,// *ngFor
    FormsModule, //表单 双向绑定
    SharedModule,
    ZmCompModule,

    BUserModule,
    StoreProductInfoBSModule,
    StorePrdRoutingModule,
    StoreCardInfoBSModule,
    ProductDetailBSModule,
    LeaguerDetailBSmodule,

  ],
  providers: [
    StoreProductInfoViewDataMgr
  ],
  entryComponents: [
    AddOrEditTypeModal,
    AddProductTypeWithReturnComp,
  ],
  exports: [

  ]
})
export class StoreProductInfoModule {
}
