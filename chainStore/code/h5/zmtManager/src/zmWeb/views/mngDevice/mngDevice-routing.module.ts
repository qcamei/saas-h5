import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AllDeviceListPage} from "./allDeviceList/allDeviceList";
import {BUserBindDeviceListPage} from "./buserBindDeviceList/buserBindDeviceList";
import {DeviceDetailListPage} from "./deviceDetailList/deviceDetailList";



const mRoutes: Routes = [
  {
    path: "allDeviceList",
    component: AllDeviceListPage,
  },
  {
    path: "buserBindDeviceList",
    component: BUserBindDeviceListPage,
  },
  {
    path: "deviceDetailList/:buserPhone",
    component: DeviceDetailListPage,
  },




];

@NgModule({
  imports: [
    RouterModule.forChild(mRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: []
})
export class MngDeviceRoutingModule {
}
