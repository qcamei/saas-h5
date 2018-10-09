import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {StoreClerkInfoViewDataMgr} from "./StoreClerkInfoViewDataMgr";
import {NgModule} from "@angular/core";
import {StoreClerkInfoRoutingModule} from "./storeClerkInfo-routing.module";
import {FindClerkPage} from "./findClerk/findClerk";
import {StoreClerkInfoBSmodule} from "../../bsModule/storeClerkInfo/StoreClerkInfo.bsmodule";
import {AddClerkPage} from "./addClerk/addClerk";
import {AllocationRolePage} from "./allocationRole/allocationRole";
import {ManageRolePage} from "./manageRole/manageRole";
import {AddAdminRolePage} from "./addAdminRole/addAdminRole";
import {EditAdminRolePage} from "./editAdminRole/editAdminRole";
import {SharedModule} from "./../common/SharedModule/SharedModule";
import {ZmCompModule} from "../zmComp/zmComp.module";

@NgModule({
  declarations:[
    //page
    FindClerkPage,
    AddClerkPage,
    AllocationRolePage,
    ManageRolePage,
    AddAdminRolePage,
    EditAdminRolePage,

  ],
  imports:[
    //公共module
    CommonModule,
    FormsModule,
    //业务module
    StoreClerkInfoBSmodule,
    //路由module
    StoreClerkInfoRoutingModule,
    //组件module
    SharedModule,
    ZmCompModule
  ],
  providers:[
    StoreClerkInfoViewDataMgr
  ]
})

export class StoreClerkInfoModule{}
