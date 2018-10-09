import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {ZmInputModule} from "../../zmComp/form/zmInput.module";
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";
import {ZmCompModule} from "../../zmComp/zmComp.module";
import { FlexLayoutModule } from "../../../../../node_modules/@angular/flex-layout";
import {MallListPage} from "./mallList.page";
import {MallListViewDataMgr} from "./mallListViewDataMgr";

@NgModule({
  declarations:[
    MallListPage,
  ],
  imports:[
    IonicPageModule.forChild(MallListPage),
    ZmCompModule,
    ZmInputModule,
    ZmBsCompModule,
    FlexLayoutModule,
  ],
  providers:[
    MallListViewDataMgr,
  ],
  exports:[
  ],
  entryComponents: [

  ]
})

export class MallListModule{}
