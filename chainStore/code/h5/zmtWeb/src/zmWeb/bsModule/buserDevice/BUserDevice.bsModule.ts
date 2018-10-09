import { NgModule } from '@angular/core';
import {BUserDeviceMgr} from "./BUserDeviceMgr";
import {BUserDeviceSynDataHolder} from "./BUserDeviceSynDataHolder";
import {DeviceDetailListMgr} from "./DeviceDetailListMgr";


@NgModule({
  declarations: [

  ],
  imports: [

  ],
  providers:[
    BUserDeviceMgr,
    DeviceDetailListMgr,
    BUserDeviceSynDataHolder,
  ],
  exports:[

  ]
})
export class BUserDeviceBSModule {}
