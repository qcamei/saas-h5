import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "./../common/SharedModule/SharedModule";
import {ZmCompModule} from "../zmComp/zmComp.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {ChainCardBsmodule} from "../../bsModule/chainCard/ChainCard.bsmodule";
import {ProductInfoListPage} from "./productInfo/productInfoList/productInfoList";
import {EditProductInfoPage} from "./productInfo/editProductInfo/editProductInfo";
import {AddProductInfoPage} from "./productInfo/addProductInfo/addProductInfo";
import {ProductInfoDetailPage} from "./productInfo/productInfoDetail/productInfoDetail";
import {ChainProductViewDataMgr} from "./chainProductViewDataMgr";
import {ProductTypeListPage} from "./productType/productTypeList";
import {ChainProductRoutingModule} from "./chainProduct-routing.module";
import {ChainProductBSModule} from "../../bsModule/chainProduct/chainProduct.bsmodule";
import {DetailDataVersionBSModule} from "../../bsModule/detailDataVersion/DetailDataVersion.bsmodule";
import {ProductionLibraryModule} from "../productionLibrary/productionLibrary.module";
import {StoreBSModule} from "../../bsModule/store/store.bsmodule";
import {ProductTypeComp} from "./productType/addProductTypeModal";
import {AddProdcutTypeWithReturnComp} from "./productInfo/comp/addProductTypeWithReturn";

@NgModule({
  declarations: [
    ProductTypeComp,
    AddProdcutTypeWithReturnComp,
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
    NgbModule,
    ZmCompModule,

    ChainProductBSModule,
    ChainProductRoutingModule,

    ChainCardBsmodule,
    DetailDataVersionBSModule,

    ProductionLibraryModule,
    StoreBSModule,
  ],
  providers: [
    ChainProductViewDataMgr
  ],
  entryComponents: [
    ProductTypeComp,
    AddProdcutTypeWithReturnComp,
  ],
  exports: [

  ]
})
export class ChainProductModule {
}
