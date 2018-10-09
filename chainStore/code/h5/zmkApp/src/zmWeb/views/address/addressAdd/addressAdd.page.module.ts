import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {ZmInputModule} from "../../zmComp/form/zmInput.module";
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";
import {ZmCompModule} from "../../zmComp/zmComp.module";
import { FlexLayoutModule } from "../../../../../node_modules/@angular/flex-layout";
import { CityDataProvider } from "../cityDataProvider/cityDataProvider";
// import { MultiPickerModule } from "../../../../../node_modules/ion-multi-picker";
import {MultiPickerModule} from 'ion-multi-picker';
import {AddressAddPage} from "./addressAdd.page";

@NgModule({
  declarations:[
    AddressAddPage
  ],
  imports:[
    IonicPageModule.forChild(AddressAddPage),
    ZmCompModule,
    ZmInputModule,
    ZmBsCompModule,
    FlexLayoutModule,
    MultiPickerModule
  ],
  providers:[
    CityDataProvider
  ],
  exports:[
  ],
  entryComponents: [

  ]
})

export class AddressAddPageModule{}
