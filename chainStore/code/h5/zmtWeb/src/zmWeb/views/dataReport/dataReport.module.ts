/**
 * Created by Administrator on 2017/12/18 0018.
 */
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SharedModule} from "../common/SharedModule/SharedModule";
import {ConsumeReportPage} from "./consumeReport/consumeReport";
import {LeaguerReportPage} from "./leaguerReport/leaguerReport";
import {DataReportRoutingModule} from "./dataReport-routing.module";
import {DataReportBSModule} from "../../bsModule/dataReport/DataReport.bsmodule";
import {DataReportViewDataMgr} from "./dataReportViewDataMgr";
import {LeaguerMemberCardTypePipe} from "./pipe/leaguerMemberCardTypePipe";
import {StoreLeaguerInfoBSmodule} from "../../bsModule/storeLeaguerInfo/StoreLeaguerInfo.bsmodule";
import {StoreCardInfoBSModule} from "../../bsModule/storeCardInfo/StoreCardInfo.bsmodule";
import {StoreGoodsBSModule} from "../../bsModule/storeGoods/StoreGoods.bsModule";
import {FormsModule} from "@angular/forms";
import {ZmCompModule} from "../zmComp/zmComp.module";
import {LeaguerDetailBSmodule} from "../../bsModule/leaguerDetail/LeaguerDetail.bsmodule";
import {StoreProductInfoBSModule} from "../../bsModule/StoreProductInfo/StoreProductInfo.bsModule";
import {StorePackageProjectBSModule} from "../../bsModule/storePackageProject/StorePackageProject.bsModule";


@NgModule({
  declarations:[
    //page
    LeaguerReportPage,
    ConsumeReportPage,

    //pipe
    LeaguerMemberCardTypePipe,
  ],
  imports:[
    //公共module
    CommonModule,
    FormsModule,
    //zm公共组件
    ZmCompModule,
    //业务module
    DataReportBSModule,
    StoreLeaguerInfoBSmodule,
    StoreCardInfoBSModule,
    StoreProductInfoBSModule,
    StoreGoodsBSModule,
    StorePackageProjectBSModule,
    LeaguerDetailBSmodule,
    //路由module
    DataReportRoutingModule,
    SharedModule,
  ],
  providers:[
    DataReportViewDataMgr,
  ]
})
export class DataReportModule{}
