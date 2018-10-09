import {FindStorePage} from "./findStore/findStore";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {StoreBSmodule} from "../../bsModule/store/Store.bsmodule";
import {StoreViewDataMgr} from "./StoreViewDataMgr";
import {NgModule} from "@angular/core";
import {StoreRoutingModule} from "./store-routing.module";
import {AddStorePage} from "./addStore/addStore";
import {EditStorePage} from "./editStore/editStore";
import {StoreDetailPage} from "./storeDetail/storeDetail";
import {BossAddStorePage} from "./bossAddStore/bossAddStore";
import {ClerkApplyStorePage} from "./clerkApplyStore/clerkApplyStore";
import {ApplyStorePage} from "./applyStore/applyStore";
import {StoreClerkInfoBSmodule} from "../../bsModule/storeClerkInfo/StoreClerkInfo.bsmodule";
import {SharedModule} from "./../common/SharedModule/SharedModule";
import {BUserBSModule} from "../../bsModule/buser/BUser.bsModule";
import {ZmCompModule} from "../zmComp/zmComp.module";
import {DeleteStoreModalComp} from "./findStore/deleteStoreModalComp";
import { ApplyChainComp } from "./applayChain/applyChain";
import {ChainBSmodule} from "../../bsModule/chain/Chain.bsmodule";
import {ZmFormPrice} from "./editStore/zmFormPrice";

@NgModule({
  declarations:[
    ZmFormPrice,
    // modal
    DeleteStoreModalComp,
    //page
    FindStorePage,
    AddStorePage,
    EditStorePage,
    StoreDetailPage,
    BossAddStorePage,
    ClerkApplyStorePage,
    ApplyStorePage,
    ApplyChainComp,
  ],
  imports:[
    //公共module
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    //公共组件
    ZmCompModule,
    //业务module
    StoreBSmodule,
    StoreClerkInfoBSmodule,
    BUserBSModule,
    ChainBSmodule,
    //路由module
    StoreRoutingModule,
    SharedModule
  ],
  providers:[
    StoreViewDataMgr
  ],
  entryComponents:[
    // modal
    DeleteStoreModalComp,
    ApplyChainComp,
  ]
})

export class StoreModule{}
