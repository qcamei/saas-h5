import {NgModule} from "@angular/core";
import {SharedModule} from "../common/SharedModule/SharedModule";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ZmCompModule} from "../zmComp/zmComp.module";
import {BuserMessageViewDataMgr} from "./BuserMessageViewDataMgr";
import {BuserMessageListPage} from "./buserMessageList/BuserMessageList";
import {BuserMessageRoutingModule} from "./BuserMessage-routing.module";
import {BuserMessageBsmodule} from "../../bsModule/buserMessage/BuserMessage.bsmodule";

@NgModule({
  declarations:[
    BuserMessageListPage,
  ],
  imports:[
    //公共模块
    CommonModule,
    FormsModule,
    ZmCompModule,
    SharedModule,
    // 轮播

    //业务
    BuserMessageBsmodule,

    //路由
    BuserMessageRoutingModule,
  ],
  providers:[
    BuserMessageViewDataMgr,
  ]
})
export class BuserMessageModule{

}
