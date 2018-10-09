import {IonicPageModule} from "ionic-angular";
import {ZmInputModule} from "../../zmComp/form/zmInput.module";
import {ZmCompModule} from "../../zmComp/zmComp.module";
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";
import {NgModule} from "@angular/core";
import {ProductCardDetailPage} from "./productCardDetail.page";
import {ProductCardDetailViewDataMgr} from "./productCardDetailViewDataMgr";


@NgModule({
  declarations: [
    ProductCardDetailPage,
  ],

  imports: [
    IonicPageModule.forChild(ProductCardDetailPage),
    ZmCompModule,
    ZmInputModule,
    ZmBsCompModule,
  ],
  providers:[
    ProductCardDetailViewDataMgr
  ]


})
export class ProductCardDetailPageModule {}
