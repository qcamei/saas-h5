import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {ZmCompModule} from "../../zmComp/zmComp.module";
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";
import {ZmInputModule} from "../../zmComp/form/zmInput.module";
import {AddLabelPage} from "./AddLabel.page";


@NgModule({
  declarations:[
    AddLabelPage,
  ],
  imports:[
    IonicPageModule.forChild(AddLabelPage),

    //公共module
    ZmCompModule,
    ZmBsCompModule,
    ZmInputModule,
  ]
})
export class AddLabelPageModule{}
