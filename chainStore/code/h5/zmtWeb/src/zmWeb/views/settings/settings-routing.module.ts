import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {SettingsPage} from "./page/settings";
import {setGoodsPage} from "./setGoods/setGoods";
import {setProductPage} from "./setProduct/setProduct";
import {setLeaguerPage} from "./setLeaguer/setLeaguer";
import {SetSourcePage} from "./setSource/setSource";
import {SetTypePage} from "./setType/setType";
import {SetAppointmentPage} from "./setAppointment/setAppointment";
import {SetAttributePage} from "./setAttribute/setAttribute";
import { SetBossPayInfoPage } from "./setBossPayInfo/setBossPayInfo";

const mRoutes:Routes = [
  {
    path:"index",
    component:SettingsPage
  },
  {
    path:"setLeaguer",
    component:setLeaguerPage
  },
  {
    path:"setProduct",
    component:setProductPage
  },
  {
    path:"setGoods",
    component:setGoodsPage
  },
  {
    path:"setSource",
    component:SetSourcePage
  },
  {
    path:"setType",
    component:SetTypePage
  },
  {
    path:"setAppointment",
    component:SetAppointmentPage
  },
  {
    path:"setAttribute",
    component:SetAttributePage
  },
  {
    path:"setBossPayInfo",
    component:SetBossPayInfoPage
  },

]

@NgModule({
  imports:[
    RouterModule.forChild(mRoutes)
  ],
  exports:[
    RouterModule
  ],
  providers:[]
})

export class SettingsRoutingModule{}
