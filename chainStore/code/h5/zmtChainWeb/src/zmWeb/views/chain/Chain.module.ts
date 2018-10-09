import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {ZmCompModule} from "../zmComp/zmComp.module";
import {SharedModule} from "../common/SharedModule/SharedModule";
import {ChainViewDataMgr} from "./ChainViewDataMgr";
import {StoreListPage} from "./storeList/storeList";
import {AddChainPage} from "./addChain/addChain";
import {ChainBSModule} from "../../bsModule/chain/Chain.bsmodule";
import {StoreBSModule} from "../../bsModule/store/store.bsmodule";
import {EditChainPage} from "./editChain/editChain";
import {ChainDetailPage} from "./chainDetail/chainDetail";
import {ChainRoutingModule} from "./Chain-routing.module";

@NgModule({
  declarations:[

    StoreListPage,
    AddChainPage,
    EditChainPage,
    ChainDetailPage
  ],
  imports:[
    //公共module
    CommonModule,
    FormsModule,
    NgbModule,
    ZmCompModule,
    SharedModule,

    StoreBSModule,
    ChainBSModule,
    ChainRoutingModule,

  ],
  providers:[
    ChainViewDataMgr
  ],
  entryComponents:[

  ]
})

export class ChainModule{}
