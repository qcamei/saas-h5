import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {GuidePage} from "./guide/guide";
import {GuideRoutingModule} from "./guide-routing.module";
import {SharedModule} from "./../common/SharedModule/SharedModule";
import {ZmCompModule} from "../zmComp/zmComp.module";
@NgModule({
  declarations: [
    GuidePage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    // 组件模块
    SharedModule,
    ZmCompModule,
    //业务模块

    //路由
    GuideRoutingModule,
  ],
  providers: [

  ],
  entryComponents: [

  ]
})
export class GuideModule {
}
