import {NgModule} from "@angular/core";
import {AddLeaguerPage} from "./AddLeaguer.page";
import {IonicPageModule} from "ionic-angular";
import {ZmCompModule} from "../../zmComp/zmComp.module";
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";
import {ZmInputModule} from "../../zmComp/form/zmInput.module";
import {ZmDatePipe} from "../../zmComp/pipe/ZmDatePipe";


@NgModule({
  declarations:[
    AddLeaguerPage,
  ],
  imports:[
    IonicPageModule.forChild(AddLeaguerPage),

    //公共module
    ZmCompModule,
    ZmBsCompModule,
    ZmInputModule,
  ],
  providers:[

  ]
})
export class AddLeaguerPageModule{}
