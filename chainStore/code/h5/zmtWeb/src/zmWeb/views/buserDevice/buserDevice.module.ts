import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {SharedModule} from "../common/SharedModule/SharedModule";
import { DevInfoComponent} from "./Comp/devInfoShopModel";
import {BUserDeviceRoutingModule} from "./buserDevice-routing.module";
import {BUserDeviceViewDataMgr} from "./BUserDeviceViewDataMgr";
import {BUserDeviceBSModule} from "../../bsModule/buserDevice/BUserDevice.bsModule";
import {DeviceStatePipe} from "./Pipe/deviceStatePipe";
import {NetStatePipe} from "./Pipe/netStatusPipe";
import {UserDeviceListPage} from "./userDeviceList/userDeviceList";
import {StoreDeviceListPage} from "./storeDeviceList/storeDeviceList";
import {FormsModule} from "@angular/forms";
import {ZmCompModule} from "../zmComp/zmComp.module";
import {LockStatePipe} from "./Pipe/lockStatusPipe";


@NgModule({
  declarations:[
    UserDeviceListPage,
    StoreDeviceListPage,
    //分配到店
    DevInfoComponent,

    DeviceStatePipe,
    NetStatePipe,
    LockStatePipe,
  ],
  imports:[
    CommonModule,// *ngFor
    FormsModule, //表单 双向绑定
    //组件module
    SharedModule,
    ZmCompModule,

    BUserDeviceRoutingModule,
    BUserDeviceBSModule,




  ],
  entryComponents: [
    DevInfoComponent,
  ],
  providers:[
    BUserDeviceViewDataMgr,
  ]
})

export class  BUserDeviceModule{}
