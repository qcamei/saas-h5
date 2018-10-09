import {IonicPageModule} from "ionic-angular";
import {ZmInputModule} from "../../zmComp/form/zmInput.module";
import {NgModule} from "@angular/core";
import {ZmCompModule} from "../../zmComp/zmComp.module";
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";
import {AppointmentAddPage} from "./appointmentAdd.page";
import {ProductSelectComp} from "../productSelectComp/productSelect.comp";
import {SelectedProductListComp} from "../productSelectComp/selectedProductList.comp";
import {SharedModule} from "../../common/SharedModule";

@NgModule({
  declarations: [
    AppointmentAddPage,
    ProductSelectComp,
    SelectedProductListComp,
  ],

  imports: [
    IonicPageModule.forChild(AppointmentAddPage),
    ZmCompModule,
    ZmInputModule,
    ZmBsCompModule,
    SharedModule,
  ],
  providers: []


})
export class AppointmentAddPageModule {
}
