import {IonicPageModule} from "ionic-angular";
import {ZmInputModule} from "../../zmComp/form/zmInput.module";
import {ZmCompModule} from "../../zmComp/zmComp.module";
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";
import {NgModule} from "@angular/core";
import {MemCardDetailPage} from "./memCardDetail.page";
import {MemCardDetailViewDataMgr} from "./memCardDetailViewDataMgr";
import {ZmPipeModule} from "../../zmComp/pipe/zmPipe.module";
import {FlexLayoutModule} from "@angular/flex-layout";
/**
 * Created by Administrator on 2018/7/31 0031.
 */

@NgModule({
  declarations: [
    MemCardDetailPage,
  ],

  imports: [
    IonicPageModule.forChild(MemCardDetailPage),
    ZmCompModule,
    ZmInputModule,
    ZmBsCompModule,
    ZmPipeModule,
    FlexLayoutModule
  ],
  providers:[
    MemCardDetailViewDataMgr
  ]


})
export class MemCardDetailPageModule{}
