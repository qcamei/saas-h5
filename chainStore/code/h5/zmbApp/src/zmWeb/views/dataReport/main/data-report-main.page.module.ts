/**
 * @Description
 * @Creator geefox
 * @E-mail firstblh@163.com
 * @Date 2018/9/25
 */
import {DataReportMainPage} from "./data-report-main.page";
import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {ZmCompModule} from "../../zmComp/zmComp.module";
import {ZmInputModule} from "../../zmComp/form/zmInput.module";
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";


@NgModule({
  declarations: [
    DataReportMainPage,
  ],

  imports: [
    IonicPageModule.forChild(DataReportMainPage),
    ZmCompModule,
    ZmInputModule,
    ZmBsCompModule,
  ],
  providers:[
  ]
})
export class DataReportMainPageModule {

    constructor() {

    }


}
