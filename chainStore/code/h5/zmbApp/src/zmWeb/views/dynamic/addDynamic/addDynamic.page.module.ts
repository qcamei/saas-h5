import {NgModule} from "@angular/core";
import {AddDynamicPage} from "./addDynamic.page";
import {IonicPageModule} from "ionic-angular";
import {ZmCompModule} from "../../zmComp/zmComp.module";
import {ZmInputModule} from "../../zmComp/form/zmInput.module";
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";

@NgModule({
  declarations:[
    AddDynamicPage,
  ],
  imports:[
    IonicPageModule.forChild(AddDynamicPage),
    ZmCompModule,
    ZmInputModule,
    ZmBsCompModule,
  ],
  exports:[

  ],
  providers:[

  ]
})
export class AddDynamicPageModule{}
