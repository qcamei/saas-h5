import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {VipLevelTypeBSModule} from "../../bsModule/vipLevelType/VipLevelType.bsmodule";
import {ThemeModule} from "../../../app/@theme/theme.module";
import {ToasterModule} from "angular2-toaster";
import {SharedModule} from "../common/SharedModule/SharedModule";
import {VipLevelTypeRoutingModule} from "./vipLevelType-routing.module";
import {VipLevelTypeViewDataMgr} from "./vipLevelTypeViewDataMgr";
import {ZmCompModule} from "../zmComp/zmComp.module";
import {VipLevelTypeComp} from "./comp/VipLevelTypeComp";
import {VipLevelTypeListPage} from "./list";
import {VipLevelTypeStatePipe, VipLevelTypeStatePipe2} from "./pipe/VipLevelTypeStatePipe";
import {VipLevelBSModule} from "../../bsModule/vipLevel/VipLevel.bsmodule";
import {AddTypeAndReturnComp} from "./comp/AddTypeAndReturnComp";

@NgModule({
  declarations: [
    VipLevelTypeListPage,

    VipLevelTypeComp,
    AddTypeAndReturnComp,

    VipLevelTypeStatePipe,
    VipLevelTypeStatePipe2
  ],
  imports: [
    CommonModule,
    FormsModule,
    ThemeModule,
    ToasterModule,
    ZmCompModule,
    SharedModule,

    VipLevelBSModule,
    VipLevelTypeBSModule,
    VipLevelTypeRoutingModule,

  ],
  providers: [
    VipLevelTypeViewDataMgr
  ],
  exports: [],
  entryComponents: [
    VipLevelTypeComp,
    AddTypeAndReturnComp
  ]
})
export class VipLevelTypeModule {
}
