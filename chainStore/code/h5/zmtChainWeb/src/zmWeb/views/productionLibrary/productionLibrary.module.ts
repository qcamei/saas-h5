import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZmCompModule } from '../zmComp/zmComp.module';
import { SharedModule } from '../common/SharedModule/SharedModule';
import { ProductionLibraryRoutingModule } from './productionLibrary-routing.module';
import { LibraryListPage } from './libraryList/libraryList';
import {StoreListComp} from "./Comp/storeListComp/StoreListComp";
import {StoreBSModule} from "../../bsModule/store/store.bsmodule";
import {ProductLibraryViewDataMgr} from "./productLibraryViewDataMgr";
import {sellProductBSModule} from "../../bsModule/sellProduct/sellProduct.bsmodule";
import {SellProductTypePipe} from "./Pipe/sellProductTypePipe";
import {ApplyStorePipe} from "./Pipe/applyStorePipe";

@NgModule({
  declarations: [
    LibraryListPage,
    StoreListComp,

    SellProductTypePipe,
    ApplyStorePipe,
  ],
  imports: [
    CommonModule,
    ZmCompModule,
    SharedModule,

    StoreBSModule,
    sellProductBSModule,
    ProductionLibraryRoutingModule,
  ],
  providers: [
    ProductLibraryViewDataMgr,
  ],
  exports:[

  ],
  entryComponents: [
    StoreListComp,
  ],

})
export class ProductionLibraryModule { }
