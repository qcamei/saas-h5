import { NgModule } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {IonicModule} from "ionic-angular";
import {ZmkAppointProductItem} from "./ZmkAppointProductItem";
import {SharedModule} from "../../../common/SharedModule";
import {ZmCompModule} from "../../../zmComp/zmComp.module";



@NgModule({
  declarations: [
    ZmkAppointProductItem,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ZmCompModule,
  ],
  providers: [],

  exports:[
    ZmkAppointProductItem,
  ]
})
export class ZmAppointProductCompModule{}
