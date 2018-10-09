import {IonicPageModule} from "ionic-angular";
import {ZmInputModule} from "../../zmComp/form/zmInput.module";
import {ZmCompModule} from "../../zmComp/zmComp.module";
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";
import {NgModule} from "@angular/core";
import { OrderDetailPage } from "./orderDetail.page";
import {OrderDetailViewDataMgr} from "./orderDetailViewDataMgr";
/**
 * Created by Administrator on 2018/7/31 0031.
 */

@NgModule({
  declarations: [
    OrderDetailPage,
  ],

  imports: [
    IonicPageModule.forChild(OrderDetailPage),
    ZmCompModule,
    ZmInputModule,
    ZmBsCompModule,
  ],
  providers:[
    OrderDetailViewDataMgr
  ]


})
export class OrderDetailPageModule {}
