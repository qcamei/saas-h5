import {NgModule} from "@angular/core";
import {ChainGoodsSynDataHolder} from "./chainGoodsSynDataHolder";
import {GoodsDetailCacheDataHolder} from "./goodsDetailCacheSynHolder";
import {GoodsDetailMgr} from "./GoodsDetailMgr";
import {ChainGoodsMgr} from "./chainGoodsMgr";

@NgModule({
  declarations:[

  ],
  imports:[

  ],
  providers:[
    ChainGoodsMgr,
    ChainGoodsSynDataHolder,
    GoodsDetailCacheDataHolder,
    GoodsDetailMgr

  ]
})
export class ChainGoodsBsmodule{}
