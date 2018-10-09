import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../common/SharedModule/SharedModule";
import {ZmCompModule} from "../zmComp/zmComp.module";
import {OpLogBsmodule} from "../../bsModule/opLog/OpLog.bsmodule";
import {NgModule} from "@angular/core";
import { PrintRoutingModule } from "./printPreview-routing.module";
import { PrintPreviewPage } from "./printPreview/printPreview";

@NgModule({
  declarations:[
    //page
    PrintPreviewPage,
  ],
  imports:[
    //公共module
    CommonModule,
    FormsModule,
    SharedModule,
    ZmCompModule,

    //业务module
    OpLogBsmodule,

    //路由module
    PrintRoutingModule,
  ],
  exports:[
    //page
  ],
  providers:[
  ],

  entryComponents: [
  ],

})

export class PrintPreviewModule{

}
