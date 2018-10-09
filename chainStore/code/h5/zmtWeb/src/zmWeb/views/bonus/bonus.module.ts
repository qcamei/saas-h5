import {CommonModule, DatePipe} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {BonusViewDataMgr} from "./bonusViewDataMgr";
import {NgModule} from "@angular/core";
import {BonusListPage} from "./bonusList/bonusList";
import {BonusDetailPage} from "./bonusDetail/bonusDetail";
import {BonusRoutingModule} from "./bonus-routing.module";
import {SharedModule} from "./../common/SharedModule/SharedModule";
import {BonusTypePipeComp} from "./pipe/BonusTypePipeComp";
import {RolePipeComp} from "./pipe/RolePipeComp";
import {BonusRecordBSmodule} from "../../bsModule/bonusRecord/BonusRecord.bsmodule";
import {StoreClerkInfoBSmodule} from "../../bsModule/storeClerkInfo/StoreClerkInfo.bsmodule";
import {BUserBSModule} from "../../bsModule/buser/BUser.bsModule";
import {ItemTypePipeComp} from "./pipe/ItemTypePipeComp";
import {StoreCardInfoBSModule} from "../../bsModule/storeCardInfo/StoreCardInfo.bsmodule";
import {StoreGoodsBSModule} from "../../bsModule/storeGoods/StoreGoods.bsModule";
import {ZmCompModule} from "../zmComp/zmComp.module";
import {StoreProductInfoBSModule} from "../../bsModule/StoreProductInfo/StoreProductInfo.bsModule";

@NgModule({
  declarations:[
    //page
    BonusListPage,
    BonusDetailPage,

    //pipe
    BonusTypePipeComp,
    RolePipeComp,
    ItemTypePipeComp,
  ],
  imports:[
    //公共module
    CommonModule,
    FormsModule,
    //业务module
    BonusRecordBSmodule,
    StoreClerkInfoBSmodule,
    StoreProductInfoBSModule,
    StoreCardInfoBSModule,
    StoreGoodsBSModule,
    BUserBSModule,
    //路由module
    BonusRoutingModule,
    //组件Module
    SharedModule,
    ZmCompModule
  ],
  providers:[
    BonusViewDataMgr,
    DatePipe
  ]
})

export class BonusModule{}
