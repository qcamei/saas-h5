import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {BUserBSModule} from "../../bsModule/buser/BUser.bsModule";
import {ExpiredPage} from "./expired/expired";
import {ErrorRoutingModule} from "./error-routing.module";
import {ExpiredGuard} from "./expired/ExpiredGuard";


@NgModule({
  declarations: [
    ExpiredPage,
  ],
  imports: [
    CommonModule,
    FormsModule,

    //业务模块
    BUserBSModule,
    //路由
    ErrorRoutingModule,
  ],
  providers: [
    ExpiredGuard,
  ],
  entryComponents: [

  ]
})
export class ErrorModule {
}
