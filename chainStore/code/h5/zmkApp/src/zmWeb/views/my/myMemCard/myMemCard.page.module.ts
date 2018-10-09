import {IonicPageModule} from "ionic-angular";
import {ZmInputModule} from "../../zmComp/form/zmInput.module";
import {ZmCompModule} from "../../zmComp/zmComp.module";
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";
import {MyMemCardPage} from "./myMemCard.page";
import {MyMemCardViewDataMgr} from "./myMemCardViewDataMgr";
import {NgModule} from "@angular/core";
import {ZmPipeModule} from "../../zmComp/pipe/zmPipe.module";
/**
 * Created by Administrator on 2018/7/31 0031.
 */

@NgModule({
  declarations: [
    MyMemCardPage,
  ],

  imports: [
    IonicPageModule.forChild(MyMemCardPage),
    ZmCompModule,
    ZmInputModule,
    ZmBsCompModule,
    ZmPipeModule,
  ],
  providers:[
    MyMemCardViewDataMgr
  ]


})
export class MyMemCardPageModule {}
