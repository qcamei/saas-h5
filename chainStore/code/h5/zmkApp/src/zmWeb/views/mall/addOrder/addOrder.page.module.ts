import {IonicPageModule} from "ionic-angular";
import {ZmInputModule} from "../../zmComp/form/zmInput.module";
import {ZmCompModule} from "../../zmComp/zmComp.module";
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";
import {NgModule} from "@angular/core";
import {AddOrderPage} from "./addOrder.page";
import {AddOrderViewDataMgr} from "./addOrderViewDataMgr";
import {AddressSelectComp} from "../../address/addressSelectComp/addressSelectComp";
/**
 * Created by Administrator on 2018/7/31 0031.
 */

@NgModule({
  declarations: [
    AddOrderPage,
    AddressSelectComp,
  ],

  imports: [
    IonicPageModule.forChild(AddOrderPage),
    ZmCompModule,
    ZmInputModule,
    ZmBsCompModule

  ],
  providers:[
    AddOrderViewDataMgr
  ]


})
export class AddOrderPageModule {}
