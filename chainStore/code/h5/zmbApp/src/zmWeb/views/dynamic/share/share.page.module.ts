import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {ZmCompModule} from "../../zmComp/zmComp.module";
import {ZmInputModule} from "../../zmComp/form/zmInput.module";
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";
import {SharePage} from "./share.page";

@NgModule({
  declarations:[
    SharePage,
  ],
  imports:[
    IonicPageModule.forChild(SharePage),
    ZmCompModule,
    ZmInputModule,
    ZmBsCompModule,
  ],
  exports:[

  ],
  providers:[

  ]
})
export class SharePageModule{}
