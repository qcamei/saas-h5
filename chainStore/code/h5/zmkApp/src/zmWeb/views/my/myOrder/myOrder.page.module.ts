import {IonicPageModule} from "ionic-angular";
import {ZmInputModule} from "../../zmComp/form/zmInput.module";
import {ZmCompModule} from "../../zmComp/zmComp.module";
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";
import {NgModule} from "@angular/core";
import { MyOrderPage } from "./myOrder.page";
import {MyOrderViewDataMgr} from "./myOrderViewDataMgr";
/**
 * Created by Administrator on 2018/7/31 0031.
 */

@NgModule({
  declarations: [
    MyOrderPage,
  ],

  imports: [
    IonicPageModule.forChild(MyOrderPage),
    ZmCompModule,
    ZmInputModule,
    ZmBsCompModule,
  ],
  providers:[
    MyOrderViewDataMgr
  ]


})
export class MyOrderPageModule {}
