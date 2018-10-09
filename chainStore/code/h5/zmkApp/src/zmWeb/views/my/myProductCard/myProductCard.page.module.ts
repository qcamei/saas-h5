import {IonicPageModule} from "ionic-angular";
import {ZmInputModule} from "../../zmComp/form/zmInput.module";
import {ZmCompModule} from "../../zmComp/zmComp.module";
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";
import {NgModule} from "@angular/core";
import {MyProductCardPage} from "./myProductCard.page";
import {MyProductCardViewDataMgr} from "./myProductCardViewDataMgr";
/**
 * Created by Administrator on 2018/7/31 0031.
 */

@NgModule({
  declarations: [
    MyProductCardPage,
  ],

  imports: [
    IonicPageModule.forChild(MyProductCardPage),
    ZmCompModule,
    ZmInputModule,
    ZmBsCompModule,

  ],
  providers:[
    MyProductCardViewDataMgr
  ]


})
export class MyProductCardPageModule {}
