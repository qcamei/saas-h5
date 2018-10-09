/**
 * @Description
 * @Creator geefox
 * @E-mail firstblh@163.com
 * @Date 2018/9/25
 */
import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {ZmCompModule} from "../../zmComp/zmComp.module";
import {ZmInputModule} from "../../zmComp/form/zmInput.module";
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";
import {CustomerStatisticPage} from "./customer-statistic.page";
// import {NgxEchartsModule} from "ngx-echarts";


@NgModule({
  declarations: [
    CustomerStatisticPage,
  ],

  imports: [
    // NgxEchartsModule,
    IonicPageModule.forChild(CustomerStatisticPage),
    ZmCompModule,
    ZmInputModule,
    ZmBsCompModule,
  ],
  providers: []
})
export class DataReportMainPageModule {

  constructor() {

  }


}
