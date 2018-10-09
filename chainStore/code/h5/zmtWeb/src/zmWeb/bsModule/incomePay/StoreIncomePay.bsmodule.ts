import {NgModule} from "@angular/core";
import {StoreIncomePayMgr} from "./StoreIncomePayMgr";
import {StoreIncomePaySynDataHolder} from "./StoreIncomePaySynDataHolder";
import {IncomePayMgr} from "./IncomePayMgr";

@NgModule({
  declarations:[

  ],
  //导入其他模块的组件
  imports:[

  ],
  //把本模块加入全局的服务表中，让它们可以被其他模块访问到
  providers:[
    StoreIncomePayMgr,
    StoreIncomePaySynDataHolder,
    IncomePayMgr,
  ]
})
export class StoreIncomePayBsmodule{}
