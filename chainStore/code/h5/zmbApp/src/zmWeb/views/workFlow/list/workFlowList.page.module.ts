import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {ZmInputModule} from "../../zmComp/form/zmInput.module";
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";
import {ZmCompModule} from "../../zmComp/zmComp.module";
import { FlexLayoutModule } from "../../../../../node_modules/@angular/flex-layout";
import {WorkFlowListPage} from "./workFlowList.page";


@NgModule({
  declarations:[
    WorkFlowListPage,
  ],
  imports:[
    IonicPageModule.forChild(WorkFlowListPage),
    ZmCompModule,

    ZmInputModule,
    ZmBsCompModule,
    FlexLayoutModule,
  ],
  providers:[
    ,
  ],
  exports:[
  ],
  entryComponents: [

  ]
})

export class WorkFlowListModule{}
