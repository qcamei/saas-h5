import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {ZmInputModule} from "../../zmComp/form/zmInput.module";
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";
import {ZmCompModule} from "../../zmComp/zmComp.module";
import { FlexLayoutModule } from "../../../../../node_modules/@angular/flex-layout";
import {OrderListPage} from "./orderList.page";
import {OrderListViewDataMgr} from "./orderListViewDataMgr";

@NgModule({
  declarations:[
    OrderListPage,
  ],
  imports:[
    IonicPageModule.forChild(OrderListPage),
    ZmCompModule,
    ZmInputModule,
    ZmBsCompModule,
    FlexLayoutModule,
  ],
  providers:[
    OrderListViewDataMgr,
  ],
  exports:[
  ],
  entryComponents: [

  ]
})

export class OrderListModule{}
