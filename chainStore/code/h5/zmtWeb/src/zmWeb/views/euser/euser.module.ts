import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {EUserBSModule} from "../../bsModule/euser/EUser.bsModule";
import {SmsBSModule} from "../../bsModule/sms/Sms.bsmodule";
import {AddEUserPage} from "./addEUser/addEUser";
import {EUserRoutingModule} from "./euser-routing.module";
import {BUserModule} from "../buser/buser.module";
import {ZmEUserInputPhone} from "./comp/ZmEUserInputPhone";



@NgModule({
  declarations: [
    AddEUserPage,
    ZmEUserInputPhone,
  ],
  imports: [
    CommonModule,
    FormsModule,

    EUserBSModule,
    EUserRoutingModule,

    BUserModule,
    SmsBSModule,

  ],
  providers: [

  ],
  entryComponents: [

  ]
})
export class EUserModule {
}
