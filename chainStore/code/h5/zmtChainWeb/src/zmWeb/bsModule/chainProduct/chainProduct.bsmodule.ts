


import {NgModule} from "@angular/core";
import {ChainProductDetailCacheSynHolder} from "./chainProductDetailCacheSynHolder";
import {ChainProductDetailMgr} from "./chainProductDetailMgr";
import {ChainProductMgr} from "./chainProductMgr";
import {ChainProductSynDataHolder} from "./chainProductSynDataHolder";

@NgModule({
  declarations:[

  ],
  imports:[

  ],
  providers:[
    ChainProductDetailCacheSynHolder,
    ChainProductDetailMgr,
    ChainProductMgr,
    ChainProductSynDataHolder,
  ]
})
export  class ChainProductBSModule{}
