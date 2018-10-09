import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {SharedModule} from "../common/SharedModule/SharedModule";
import {FormsModule} from "../../../app/pages/forms/forms.module";
import {addBindDeviceModel} from "./Comp/addBindDeviceModel";
import {ThemeModule} from "../../../app/@theme/theme.module";
import {MngDeviceRoutingModule} from "./mngDevice-routing.module";
import {MngDeviceViewDataMgr} from "./MngDeviceViewDataMgr";
import {AllDeviceListPage} from "./allDeviceList/allDeviceList";
import {MngDeviceBSModule} from "../../bsModule/mngDevice/MngDevice.bsModule";
import {MClientCtrlStatePipe} from "./pipe/mclientCtrlStatePipe";
import {MClientStautsPipe} from "./pipe/mclientStatusPipe";
import {BUserBindDeviceListPage} from "./buserBindDeviceList/buserBindDeviceList";
import {DeviceDetailListPage} from "./deviceDetailList/deviceDetailList";
import {MClientBindStatePipe} from "./pipe/mclientBindStatePipe";
import {MClientLockStateEnum} from "../../bsModule/mngDevice/data/mclient/MClientLockStateEnum";
import {MClientLockStatePipe} from "./pipe/mclientLockStatePipe";


@NgModule({
  declarations:[
    BUserBindDeviceListPage,
    DeviceDetailListPage,
    AllDeviceListPage,
    //添加绑定仪器
    addBindDeviceModel,
    //Pipe
    MClientCtrlStatePipe,
    MClientLockStatePipe,
    MClientStautsPipe,
    MClientBindStatePipe
  ],
  imports:[
    CommonModule,// *ngFor
    FormsModule, //表单 双向绑定
    ThemeModule,
    //组件module
    SharedModule,

    MngDeviceRoutingModule,
    MngDeviceBSModule,




  ],
  entryComponents: [
    addBindDeviceModel
  ],
  providers:[
    MngDeviceViewDataMgr
  ]
})

export class  MngDeviceModule{}
