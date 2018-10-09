import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {ZmInputModule} from "../../zmComp/form/zmInput.module";
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";
import {ZmCompModule} from "../../zmComp/zmComp.module";
import { FlexLayoutModule } from "../../../../../node_modules/@angular/flex-layout";
import { CityDataProvider } from "../cityDataProvider/cityDataProvider";
// import { MultiPickerModule } from "../../../../../node_modules/ion-multi-picker";

import {MultiPickerModule} from 'ion-multi-picker';
import {AddressEditPage} from "./addressEdit.page";

@NgModule({
  declarations:[
    AddressEditPage
  ],
  imports:[
    IonicPageModule.forChild(AddressEditPage),
    ZmCompModule,
    ZmInputModule,
    ZmBsCompModule,
    FlexLayoutModule,
    MultiPickerModule
  ],
  providers:[
    // GoodsListViewDataMgr,
    CityDataProvider
  ],
  exports:[
  ],
  entryComponents: [

  ]
})

export class AddressEditPageModule{}
