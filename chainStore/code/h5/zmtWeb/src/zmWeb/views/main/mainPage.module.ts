import {NgModule} from '@angular/core';
import {MainPage} from "./main.page";
import {SideBarMenuComp} from "./sideBar/SideBarMenuComp";
import {SideBarComp} from "./sideBar/sideBar";
import {CommonModule} from "@angular/common";
import {ZmCompModule} from "../zmComp/zmComp.module";
import {SharedModule} from "../common/SharedModule/SharedModule";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {ZmLayoutModule} from "../../../zmFuse/zmLayout/zmLayout.module";
import {BUserRoleBSModule} from "../../bsModule/buserRole/buserRole.bsModule";
import {BUserMessageClientMgr} from "../../bsModule/buserMessage/BUserMessageClientMgr";


@NgModule({
  declarations: [
    MainPage,
    SideBarMenuComp,
    SideBarComp,

  ],
  imports: [
    //公共module
    CommonModule,
    FormsModule,
    //组件module
    SharedModule,
    ZmCompModule,
    RouterModule,
    ZmLayoutModule,
    BUserRoleBSModule,
  ],
  providers: [
    BUserMessageClientMgr,
  ],
  exports: [
    MainPage

  ],
  entryComponents: [

  ]
})
export class MainPageModule {
}
