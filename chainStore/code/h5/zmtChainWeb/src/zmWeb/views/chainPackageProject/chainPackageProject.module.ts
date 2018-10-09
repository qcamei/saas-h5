import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZmCompModule } from '../zmComp/zmComp.module';
import { SharedModule } from '../common/SharedModule/SharedModule';
import {PackageListComp} from "./packageProject/packageList/packageList";
import {PackageDetailComp} from "./packageProject/packageDetail/packageDetail";
import {AddPackageComp} from "./packageProject/addPackage/addPackage";
import {EditPackageComp} from "./packageProject/editPackage/editPackage";
import {ChainPackageProjectBsmodule} from "../../bsModule/chainPackageProject/ChainPackageProject.bsmodule";
import {AddPackageTypeComponent} from "./packageType/addPackageTypeModal";
import {PackageTypeListComp} from "./packageType/packageTypeList";
import {FormsModule} from "@angular/forms";
import {PackageContentComp} from "./comp/packageContentComp/PackageContentComp";
import {ChainGoodsModule} from "../chainGoods/chainGoods.module";
import {ChainPackageProjectRoutingModule} from "./StorePackageProject-routing.module";
import {ChainPackageProjectViewDataMgr} from "./StorePackageProjectViewDataMgr";
import {ChainProductModule} from "../chainProduct/chainProduct.module";
import {DetailDataVersionBSModule} from "../../bsModule/detailDataVersion/DetailDataVersion.bsmodule";
import {AddPackageTypeWithReturnComp} from "./comp/addTypeWithReturn/addPackageTypeWithReturn";

@NgModule({
  declarations: [
    PackageListComp,
    PackageDetailComp,
    AddPackageComp,
    EditPackageComp,

    PackageTypeListComp,
    AddPackageTypeComponent,
    AddPackageTypeWithReturnComp,

    PackageContentComp,
  ],
  imports: [
    CommonModule,
    ZmCompModule,
    SharedModule,
    FormsModule,

    ChainPackageProjectBsmodule,
    ChainPackageProjectRoutingModule,

    ChainProductModule,
    ChainGoodsModule,
    DetailDataVersionBSModule,
  ],
  providers: [
    ChainPackageProjectViewDataMgr,
  ],
  exports:[

  ],
  entryComponents: [
    AddPackageTypeComponent,
    AddPackageTypeWithReturnComp,
    PackageContentComp
  ],

})
export class ChainPackageProjectModule { }
