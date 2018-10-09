import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {ZmInputModule} from "../../zmComp/form/zmInput.module";
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";
import {ZmCompModule} from "../../zmComp/zmComp.module";
import { FlexLayoutModule } from "../../../../../node_modules/@angular/flex-layout";
import {AddressListPage} from "./addressList.page";

@NgModule({
  declarations:[
    AddressListPage,
  ],
  imports:[
    IonicPageModule.forChild(AddressListPage),
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

export class AddressList2PageModule{}
