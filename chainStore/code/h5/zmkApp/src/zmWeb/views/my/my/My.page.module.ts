import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {MyPage} from "./My.page";
import {ZmCompModule} from "../../zmComp/zmComp.module";
import {ZmInputModule} from "../../zmComp/form/zmInput.module";
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";
import {MySimpleInfoComp} from "./comp/MySimpleInfoComp";



@NgModule({
  declarations: [
    MyPage,
    MySimpleInfoComp,
  ],
  imports: [
    IonicPageModule.forChild(MyPage),
    ZmCompModule,
    ZmInputModule,
    ZmBsCompModule,
  ],

  entryComponents:[
  ],
  exports:[
  ]

})
export class MyPageModule {}
