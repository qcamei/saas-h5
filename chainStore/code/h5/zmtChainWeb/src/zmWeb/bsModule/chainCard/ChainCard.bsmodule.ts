import {NgModule} from "@angular/core";
import {ChainCardMgr} from "./chainCardMgr";
import {ChainCardSynDataHolder} from "./chainCardSynDataHolder";
import {MembershipCardDetailCacheDataHolder} from "./MemCardDetailCacheDataHolder";
import {MembershipCardDetailMgr} from "./MemCardDetailMgr";
import {ProductCardDetailCacheDataHolder} from "./productCardDetailCacheDataHolder";
import {ProductCardDetailMgr} from "./productCardDetailMgr";


@NgModule({
  declarations:[

  ],
  imports:[

  ],
  providers:[
    ChainCardMgr,
    ChainCardSynDataHolder,
    MembershipCardDetailCacheDataHolder,
    MembershipCardDetailMgr,
    ProductCardDetailCacheDataHolder,
    ProductCardDetailMgr,
  ]
})
export  class ChainCardBsmodule{}
