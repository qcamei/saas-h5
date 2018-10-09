import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {UserDetailPage} from "./userDetail/userDetail";
import {UserCenterRoutingModule} from "./userCenter-routing.module";
import {SharedModule} from "../common/SharedModule/SharedModule";
import {ChangePasswordPage} from "./changePassword/changePassword";
import {UserCenterViewDataMgr} from "./userCenterViewDataMgr";
import {BuserVipTypePipe} from "./pipe/buserVipTypePipe";
import {FormsModule} from "@angular/forms";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {ZmCompModule} from "../zmComp/zmComp.module";
import {OldPwd} from "./changePassword/comp/OldPwd";
import {ChangePwd} from "./changePassword/comp/ChangePwd";
import {ChangePwdConfirm} from "./changePassword/comp/ChangePwdConfirm";
import {ChangePwdPhone} from "./changePassword/comp/ChangePwdPhone";
import {ChainUserModule} from "../chainUser/ChainUser.module";

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
  ],
  imports:[

    CommonModule,// *ngFor
    FormsModule, //表单 双向绑定
    NgbModule,
    SharedModule,
    ZmCompModule,

    //业务模块
    ChainUserModule,
    //路由
    UserCenterRoutingModule,

  ],
  providers:[
    UserCenterViewDataMgr,

  ]
})
export class UserCenterModule{}
