import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {NgModule} from "@angular/core";
import {SharedModule} from "../common/SharedModule/SharedModule";
import {ArrearagesRoutingModule} from "./arrearages-routing.module";
import {ArrearagesDetailsPage} from "./arrearagesDetails/arrearagesDetails";
import {ArrearagesListPage} from "./arrearagesList/arrearagesList";
import {ZmCompModule} from "../zmComp/zmComp.module";
import {ArrearagesViewDataMgr} from "./arrearagesViewDataMgr";
import {ArrearageBSmodule} from "../../bsModule/arrearage/Arrearage.bsmodule";
import {ArrearageStatusPipe} from "./pipe/arrearageStatusPipe";
import {PayPopup} from "./modal/payPopup";
import {PayRecordPopup} from "./modal/payRecordPopup";
import {PaySuccessPopup} from "./modal/paySuccessPopup";
import {StoreLeaguerInfoBSmodule} from "../../bsModule/storeLeaguerInfo/StoreLeaguerInfo.bsmodule";
import {LeaguerDetailBSmodule} from "../../bsModule/leaguerDetail/LeaguerDetail.bsmodule";

@NgModule({
  declarations:[
    //popup
    PayPopup,
    PayRecordPopup,
    PaySuccessPopup,

    //page
    ArrearagesDetailsPage,
    ArrearagesListPage,

    //pipe
    ArrearageStatusPipe
  ],
  imports:[
    //公共module
    FormsModule,
    CommonModule,
    //组件module
    SharedModule,
    ZmCompModule,
    //路由
    ArrearagesRoutingModule,
    //业务
    ArrearageBSmodule,
    StoreLeaguerInfoBSmodule,
    LeaguerDetailBSmodule,

  ],
  entryComponents: [
    //popup
    PayPopup,
    PayRecordPopup,
    PaySuccessPopup,

  ],
  providers:[
    ArrearagesViewDataMgr,
  ]
})
export class ArrearagesModule {
}
