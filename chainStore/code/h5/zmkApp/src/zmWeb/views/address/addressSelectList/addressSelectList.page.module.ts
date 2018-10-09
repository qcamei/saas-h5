import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {ZmInputModule} from "../../zmComp/form/zmInput.module";
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";
import {ZmCompModule} from "../../zmComp/zmComp.module";
import { FlexLayoutModule } from "../../../../../node_modules/@angular/flex-layout";
import {AddressSelectListPage} from "./addressSelectList.page";

@NgModule({
  declarations:[
    AddressSelectListPage,
  ],
  imports:[
    IonicPageModule.forChild(AddressSelectListPage),
    ZmCompModule,
    ZmInputModule,
    ZmBsCompModule,
    FlexLayoutModule,
  ],
  providers:[
  ],
  exports:[
  ],
  entryComponents: [

  ]
})

export class AddressSelectListPageModule{}
