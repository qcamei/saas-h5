import {NgModule} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {ThemeModule} from "../../../app/@theme/theme.module";
import {ToasterModule} from "angular2-toaster";
import {BUserCheckRoutingModule} from "./buserCheck-routing";
import {BUserCheckBSModule} from "../../bsModule/buserCheck/BUserCheck.bsModule";
import {BUserCheckListPage} from "./page/buserCheckList";
import {SharedModule} from "../common/SharedModule/SharedModule";
import {BUserBSModule} from "../../bsModule/buser/BUser.bsModule";
import {CheckStatusPipe} from "./pipe/CheckStatusPipe";
import {ZmCompModule} from "../zmComp/zmComp.module";



@NgModule({
  declarations: [

    BUserCheckListPage,
    CheckStatusPipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ThemeModule,
    ToasterModule,

    SharedModule,
    ZmCompModule,

    BUserCheckBSModule,
    BUserCheckRoutingModule,
    BUserBSModule,

  ],
  providers: [

  ],
  exports: [
    ZmCompModule
  ],
  entryComponents: [

  ]
})
export class BUserCheckModule {
}
