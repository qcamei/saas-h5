import {NgModule} from '@angular/core';
import {BUserRoutingModule} from "./buser-routing.module";
import {BUserBSModule} from "../../bsModule/buser/BUser.bsModule";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {ThemeModule} from "../../../app/@theme/theme.module";
import {ToasterModule} from "angular2-toaster";
import {BUserListPage} from "./page/buserList";
import {SharedModule} from "../common/SharedModule/SharedModule";
import {ModalComponent} from "./comp/editIntegralModalComp";
import {ZmCompModule} from "../zmComp/zmComp.module";



@NgModule({
  declarations: [

    BUserListPage,
    ModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ThemeModule,
    ToasterModule,
    SharedModule,
    ZmCompModule,

    BUserBSModule,
    BUserRoutingModule,

  ],
  providers: [

  ],
  exports: [
    ZmCompModule
  ],
  entryComponents: [
    ModalComponent
  ]
})
export class BUserModule {
}
