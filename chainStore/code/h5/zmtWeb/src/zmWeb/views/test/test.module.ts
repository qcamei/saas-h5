import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SharedModule} from "../common/SharedModule/SharedModule";
import {BUserModule} from "../buser/buser.module";
import {BUserBSModule} from "../../bsModule/buser/BUser.bsModule";
import {FormsModule} from "@angular/forms";
import {ZmCompModule} from "../zmComp/zmComp.module";
import {TestPage} from "./test";
import {TestRoutingModule} from "./test-routing.module";


@NgModule({
  declarations:[

    //pipe
    TestPage,
  ],
  imports:[

    CommonModule,// *ngFor
    FormsModule, //表单 双向绑定
    //手机号
    BUserModule,
    //组件module
    SharedModule,
    ZmCompModule,

    //业务模块
    BUserBSModule,
    ZmCompModule,

    //路由
    TestRoutingModule,

  ],
  providers:[

  ]
})
export class TestModule{}
