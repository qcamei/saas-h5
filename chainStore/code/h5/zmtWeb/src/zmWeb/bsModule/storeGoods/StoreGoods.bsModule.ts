import {NgModule} from "@angular/core";
import {StoreGoodsMgr} from "./StoreGoodsMgr";
import {StoreGoodsSynDataHolder} from "./StoreGoodsSynDataHolder";

@NgModule({
  declarations:[

  ],
  imports:[  //导入其他模块的组件

  ],
  providers:[ //把本模块加入全局的服务表中，让它们可以被其他模块访问到
    StoreGoodsMgr,
    StoreGoodsSynDataHolder
  ]
})
export  class StoreGoodsBSModule{}
