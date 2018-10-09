import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {GetQrcodePage} from "./getQrcode/getQrcode";

const routes:Routes = [
  {
    path:'getQrcode',
    component:GetQrcodePage,
  },
]
@NgModule({
  imports:[
    RouterModule.forChild(routes),
  ]
})
export class StoreQrcodeRoutingModule{}
