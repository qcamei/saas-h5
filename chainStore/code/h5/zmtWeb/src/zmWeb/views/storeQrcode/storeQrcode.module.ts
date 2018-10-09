 import {NgModule} from "@angular/core";
 import {StoreQrcodeViewDataMgr} from "./storeQrcodeViewDataMgr";
 import {GetQrcodePage} from "./getQrcode/getQrcode";
 import {CommonModule} from "@angular/common";
 import {FormsModule} from "@angular/forms";
 import {StoreBSmodule} from "../../bsModule/store/Store.bsmodule";
 import {SharedModule} from "../common/SharedModule/SharedModule";
 import {StoreQrcodeRoutingModule} from "./storeQrcodeRouting.module";
 import {ZmCompModule} from "../zmComp/zmComp.module";

 @NgModule({
   declarations:[
     GetQrcodePage,
   ],
   imports:[
     //公共module
     CommonModule,
     FormsModule,
     SharedModule,
     ZmCompModule,

     //业务module
     StoreBSmodule,

     //路由模块
     StoreQrcodeRoutingModule,
   ],
   providers:[
      StoreQrcodeViewDataMgr
   ]
 })
 export class StoreQrcodeModule{}
