import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {UserDeviceListPage} from "./userDeviceList/userDeviceList";
import {StoreDeviceListPage} from "./storeDeviceList/storeDeviceList";



const mRoutes: Routes = [
  {
    path: "userDeviceList",
    component: UserDeviceListPage,
  },
  {
    path: "storeDeviceList",
    component: StoreDeviceListPage,
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
export class BUserDeviceRoutingModule {
}
