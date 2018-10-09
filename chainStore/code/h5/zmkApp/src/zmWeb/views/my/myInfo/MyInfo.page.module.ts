import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";
import {ZmInputModule} from "../../zmComp/form/zmInput.module";
import {ZmCompModule} from "../../zmComp/zmComp.module";
import {MyOrderViewDataMgr} from "../myOrder/myOrderViewDataMgr";
import {MyInfoPage} from "./MyInfo.page";

@NgModule({
  declarations: [
    MyInfoPage,
  ],

  imports: [
    IonicPageModule.forChild(MyInfoPage),
    ZmCompModule,
    ZmInputModule,
    ZmBsCompModule,


  ],
  providers:[
    MyOrderViewDataMgr
  ]


})
export class MyOrderPageModule {}
