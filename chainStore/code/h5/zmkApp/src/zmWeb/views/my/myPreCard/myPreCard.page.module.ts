import {IonicPageModule} from "ionic-angular";
import {ZmInputModule} from "../../zmComp/form/zmInput.module";
import {ZmCompModule} from "../../zmComp/zmComp.module";
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";
import {NgModule} from "@angular/core";
import {MyPreCardPage} from "./myPreCard.page";
import {MyPreCardViewDataMgr} from "./myPreCardViewDataMgr";
/**
 * Created by Administrator on 2018/7/31 0031.
 */

@NgModule({
  declarations: [
    MyPreCardPage,
  ],

  imports: [
    IonicPageModule.forChild(MyPreCardPage),
    ZmCompModule,
    ZmInputModule,
    ZmBsCompModule,
  ],
  providers:[
    MyPreCardViewDataMgr
  ]


})
export class MyPreCardPageModule {}
