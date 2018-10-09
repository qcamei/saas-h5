import {IonicPageModule} from "ionic-angular";
import {ZmInputModule} from "../../zmComp/form/zmInput.module";
import {NgModule} from "@angular/core";
import {ZmCompModule} from "../../zmComp/zmComp.module";
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";
import {ProductSelectListPage} from "./productSelectList.page";

@NgModule({
  declarations: [
    ProductSelectListPage,
  ],

  imports: [
    IonicPageModule.forChild(ProductSelectListPage),
    ZmCompModule,
    ZmInputModule,
    ZmBsCompModule,
  ],
  providers: []


})
export class AppointmentAddPageModule {
}
