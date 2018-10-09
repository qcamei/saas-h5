import {NgModule} from "@angular/core";
import {VipLevelListPage} from "./vipLevelList/vipLevelList";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {VipLevelBSModule} from "../../bsModule/vipLevel/VipLevel.bsmodule";
import {ThemeModule} from "../../../app/@theme/theme.module";
import {ToasterModule} from "angular2-toaster";
import {SharedModule} from "../common/SharedModule/SharedModule";
import {VipLevelRoutingModule} from "./vipLevel-routing.module";
import {VipLevelViewDataMgr} from "./VipLevelViewDataMgr";
import {ValidPeriodUnitPipe} from "./pipe/ValidPeriodUnitPipe";
import {VipLevelStatePipe, VipLevelStatePipe2} from "./pipe/VipLevelStatePipe";
import {ZmCompModule} from "../zmComp/zmComp.module";
import {AddVipLevelPage} from "./addVipLevel/addVipLevel";
import {StoreMenuBSModule} from "../../bsModule/storeMenu/storeMenu.bsmodule";
import {EditVipLevelPage} from "./editVipLevel/editVipLevel";
import {VipLevelTypeModule} from "../vipLevelType/vipLevelType.module";
@NgModule({
  declarations: [
    VipLevelListPage,
    AddVipLevelPage,
    EditVipLevelPage,

    ValidPeriodUnitPipe,
    VipLevelStatePipe,
    VipLevelStatePipe2
  ],
  imports: [
    CommonModule,
    FormsModule,
    ThemeModule,
    ToasterModule,
    ZmCompModule,
    SharedModule,

    VipLevelBSModule,
    VipLevelRoutingModule,
    VipLevelTypeModule,
    StoreMenuBSModule,

  ],
  providers: [
    VipLevelViewDataMgr
  ],
  exports: [],
  entryComponents: []
})
export class VipLevelModule {
}
