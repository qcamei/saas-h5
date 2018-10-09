import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {ZmCompModule} from "../zmComp/zmComp.module";
import {SharedModule} from "../common/SharedModule/SharedModule";
import {ChainClerkBSModule} from "../../bsModule/chainClerk/ChainClerk.bsmodule";
import {ChainClerkViewDataMgr} from "./ChainClerkViewDataMgr";
import {ChainClerkRoutingModule} from "./chainClerk-routing.module";
import { AddClerkComp } from "./Comp/addClerk/addClerk";
import {BUserBSModule} from "../../bsModule/buser/buser.bsmodule";
import {ProductionLibraryModule} from "../productionLibrary/productionLibrary.module";
import {StoreClerkBSModule} from "../../bsModule/storeClerk/storeClerk.bsmodule";
import {ManageRolePage} from "./manageRole/manageRole";
import {EditAdminRolePage} from "./editAdminRole/editAdminRole";
import {AddAdminRolePage} from "./addAdminRole/addAdminRole";
import {AllocationRolePage} from "./allocationRole/allocationRole";
import {FindClerkPage} from "./findClerk/findClerk";
import {ChainUserBSModule} from "../../bsModule/chainUser/ChainUser.bsmodule";
import {EditClerkComp} from "./Comp/editClerk/editClerk";
import {ZmPassword} from "./Comp/zmPassword";
import {ClerkMatTableCheckbox} from "./Comp/ClerkMatTableCheckbox";

@NgModule({
  declarations:[
    ManageRolePage,
    EditAdminRolePage,
    AddAdminRolePage,
    AllocationRolePage,
    FindClerkPage,

    AddClerkComp,
    EditClerkComp,
    ClerkMatTableCheckbox,

    ZmPassword,

  ],
  imports:[
    //公共module
    CommonModule,
    FormsModule,
    NgbModule,
    ZmCompModule,
    SharedModule,


    ProductionLibraryModule,
    BUserBSModule,
    ChainClerkBSModule,
    ChainClerkRoutingModule,
    StoreClerkBSModule,
    ChainUserBSModule,

  ],
  providers:[
    ChainClerkViewDataMgr
  ],
  entryComponents:[
    AddClerkComp,
    EditClerkComp,
    ZmPassword,
  ]
})

export class ChainClerkModule{}
