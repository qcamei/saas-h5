import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZmCompModule } from '../zmComp/zmComp.module';
import { SharedModule } from '../common/SharedModule/SharedModule';
import {StorePackageProjectRoutingModule} from "./StorePackageProject-routing.module";
import {PackageListComp} from "./packageProject/packageList/packageList";
import {PackageDetailComp} from "./packageProject/packageDetail/packageDetail";
import {AddPackageComp} from "./packageProject/addPackage/addPackage";
import {EditPackageComp} from "./packageProject/editPackage/editPackage";
import {StorePackageProjectBSModule} from "../../bsModule/storePackageProject/StorePackageProject.bsModule";
import {StorePackageProjectViewDataMgr} from "./StorePackageProjectViewDataMgr";
import {AddPackageTypeComponent} from "./packageType/addPackageTypeModal";
import {PackageTypeListComp} from "./packageType/packageTypeList";
import {FormsModule} from "@angular/forms";
import {PackageContentComp} from "./comp/packageContentComp/PackageContentComp";
import {StoreProductInfoModule} from "../storeProductInfo/storeProduct.module";
import {StoreGoodsModule} from "../storeGoods/storeGoods.module";
import {ProductDetailBSModule} from "../../bsModule/productDetail/ProductDetail.bsModule";
import {GoodsDetailBSModule} from "../../bsModule/goodsDetail/GoodsDetail.bsmodule";
import {AddPackageTypeWithReturnComp} from "./addTypeWithReturn/addPackageTypeWithReturn";

@NgModule({
  declarations: [
    PackageListComp,
    PackageDetailComp,
    AddPackageComp,
    EditPackageComp,

    PackageTypeListComp,
    AddPackageTypeComponent,

    PackageContentComp,
    AddPackageTypeWithReturnComp,
  ],
  imports: [
    CommonModule,
    ZmCompModule,
    SharedModule,
    FormsModule,

    StoreProductInfoModule,
    StoreGoodsModule,
    ProductDetailBSModule,
    GoodsDetailBSModule,
    StorePackageProjectBSModule,
    StorePackageProjectRoutingModule,
  ],
  providers: [
    StorePackageProjectViewDataMgr,
  ],
  exports:[
    AddPackageTypeWithReturnComp,
  ],
  entryComponents: [
    AddPackageTypeComponent,
    PackageContentComp,
    AddPackageTypeWithReturnComp,
  ],

})
export class StorePackageProjectModule { }
