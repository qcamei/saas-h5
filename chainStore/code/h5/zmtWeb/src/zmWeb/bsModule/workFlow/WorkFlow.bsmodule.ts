import {NgModule} from "@angular/core";
import {WorkFlowMgr} from "./WorkFlowMgr";
import {WorkFlowSynDataHolder} from "./WorkFlowSynDataHolder";
import {LeaguerWFMgr} from "./LeaguerWFMgr";
import {ProductWFMgr} from "./ProductWFMgr";
import {ReducePrdCardWFMgr} from "./ReducePrdCardWFMgr";
import {PurchaseGoodsWFMgr} from "./PurchaseGoodsWFMgr";
import {PurchasePrdCardWFMgr} from "./PurchasePrdCardWFMgr";
import {BonusWFMgr} from "./BonusWFMgr";
import {OrderWFMgr} from "./OrderWFMgr";
import {MemCardInfoWFMgr} from "./MemCardInfoWFMgr";
import {PackageRecordWFMgr} from "./PackageRecordWFMgr";
import {DelimitCardRecordWFMgr} from "./DelimitCardRecordWFMgr";


@NgModule({
  declarations:[

  ],
  imports:[

  ],
  providers:[
    WorkFlowMgr,
    LeaguerWFMgr,
    ProductWFMgr,
    ReducePrdCardWFMgr,
    DelimitCardRecordWFMgr,
    PurchaseGoodsWFMgr,
    PurchasePrdCardWFMgr,
    PackageRecordWFMgr,
    BonusWFMgr,
    OrderWFMgr,
    MemCardInfoWFMgr,
    WorkFlowSynDataHolder
  ]
})
export  class WorkFlowBSmodule{}
