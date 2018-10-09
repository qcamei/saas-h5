import {NgModule} from '@angular/core';
import {MainPage} from "./page/main.page";
import {SideBarMenuComp} from "./sideBar/SideBarMenuComp";
import {SideBarComp} from "./sideBar/sideBar";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {CommonModule} from "@angular/common";
import {ZmCompModule} from "../zmComp/zmComp.module";
import {SharedModule} from "../common/SharedModule/SharedModule";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {ZmLayoutModule} from "../../../zmFuse/zmLayout/zmLayout.module";


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
    NgbModule,
    //组件module
    SharedModule,
    ZmCompModule,
    RouterModule,
    ZmLayoutModule,

  ],
  providers: [

  ],
  exports: [
    MainPage

  ],
  entryComponents: [

  ]
})
export class MainPageModule {
}
