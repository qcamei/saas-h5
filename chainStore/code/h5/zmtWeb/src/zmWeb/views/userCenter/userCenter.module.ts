import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {UserDetailPage} from "./userDetail/userDetail";
import {UserCenterRoutingModule} from "./userCenter-routing.module";
import {SharedModule} from "../common/SharedModule/SharedModule";
import {ChangePasswordPage} from "./changePassword/changePassword";
import {BUserModule} from "../buser/buser.module";
import {UserCenterViewDataMgr} from "./userCenterViewDataMgr";
import {BuserVipTypePipe} from "./pipe/buserVipTypePipe";
import {FormsModule} from "@angular/forms";
import {ZmCompModule} from "../zmComp/zmComp.module";
import {ChangePwd} from "./changePassword/comp/ChangePwd";
import {ChangePwdConfirm} from "./changePassword/comp/ChangePwdConfirm";
import {OldPwd} from "./changePassword/comp/OldPwd";
import {ChangePwdPhone} from "./changePassword/comp/ChangePwdPhone";
import {ChangePwdVCode} from "./changePassword/comp/ChangePwdVCode";
import {SmsBSModule} from "../../bsModule/sms/Sms.bsmodule";


@NgModule({
  declarations:[
    UserDetailPage,
    ChangePasswordPage,

    //pipe
    BuserVipTypePipe,
    OldPwd,
    ChangePwd,
    ChangePwdConfirm,
    ChangePwdPhone,
    ChangePwdVCode,
  ],
  imports:[

    CommonModule,// *ngFor
    FormsModule, //表单 双向绑定

    //组件module
    SharedModule,
    ZmCompModule,

    //业务模块
    BUserModule,
    ZmCompModule,
    SmsBSModule,

    //路由
    UserCenterRoutingModule,

  ],
  providers:[
    UserCenterViewDataMgr,

  ]
})
export class UserCenterModule{}
