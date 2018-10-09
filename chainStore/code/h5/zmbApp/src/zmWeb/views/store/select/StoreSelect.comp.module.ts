import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import {ZmCompModule} from "../../zmComp/zmComp.module";
import {ZmInputModule} from "../../zmComp/form/zmInput.module";
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";
import {StoreSelectComp} from "./StoreSelect.comp";

@NgModule({
  declarations: [
    StoreSelectComp,
  ],
  imports: [
    IonicPageModule.forChild(StoreSelectComp),
    ZmCompModule,
    ZmInputModule,
    ZmBsCompModule,
  ],

  entryComponents:[
  ],
  exports:[
  ]

})
export class StoreSelectCompModule {}
