import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../common/SharedModule/SharedModule";
import {NgModule} from "@angular/core";
import {HomeRoutingModule} from "./home-routing.module";
import {HomePage} from "./page/home";
import {ChainCardBsmodule} from "../../bsModule/chainCard/ChainCard.bsmodule";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {ZmCompModule} from "../zmComp/zmComp.module";
// import {ChainUserBSModule} from "../../bsModule/chainUser/ChainUser.bsmodule";




@NgModule({
  declarations: [
    //page
    HomePage,

  ],
  imports: [
    //公共module
    CommonModule,
    FormsModule,
    NgbModule,
    SharedModule,
    ZmCompModule,

    // ChainUserBSModule,
    ChainCardBsmodule,

    //路由module
    HomeRoutingModule,

  ],
  exports:[

  ],
  providers: [
  ]
})

export class HomeModule {
}
