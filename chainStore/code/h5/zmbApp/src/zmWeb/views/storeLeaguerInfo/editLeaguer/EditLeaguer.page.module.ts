import {NgModule} from "@angular/core";
import {EditLeaguerPage} from "./EditLeaguer.page";
import {IonicPageModule} from "ionic-angular";
import {ZmCompModule} from "../../zmComp/zmComp.module";
import {ZmInputModule} from "../../zmComp/form/zmInput.module";
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";

@NgModule({
  declarations:[
    EditLeaguerPage,
  ],
  imports:[
    IonicPageModule.forChild(EditLeaguerPage),

    //公共module
    ZmCompModule,
    ZmInputModule,
    ZmBsCompModule,
  ]
})
export class EditLeaguerPageModule{}
