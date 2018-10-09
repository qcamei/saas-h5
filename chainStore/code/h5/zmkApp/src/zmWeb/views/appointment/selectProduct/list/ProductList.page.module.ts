import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {SelectProductPage} from "./ProductList.page";
import {ZmAppointProductCompModule} from "../comp/zmAppointProductComp.module";
import {ZmInputModule} from "../../../zmComp/form/zmInput.module";
import {ZmCompModule} from "../../../zmComp/zmComp.module";
import {ZmBsCompModule} from "../../../zmBSComp/zmBSComp.module";

@NgModule({
  declarations: [
    SelectProductPage,
  ],
  imports: [
    IonicPageModule.forChild(SelectProductPage),
    ZmInputModule,
    ZmCompModule,
    ZmBsCompModule,
    ZmAppointProductCompModule,
  ],

  entryComponents:[
  ],
  exports:[
  ]

})
export class ProductListPageModule {}
