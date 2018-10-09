import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {ZmBsCompModule} from "../zmBSComp/zmBSComp.module";
import {ZmInputModule} from "../zmComp/form/zmInput.module";
import {ZmCompModule} from "../zmComp/zmComp.module";
import { AppointmentPage } from './Appointment.page';

@NgModule({
  declarations: [
    AppointmentPage,
  ],
  imports: [
    IonicPageModule.forChild(AppointmentPage),
    ZmCompModule,
    ZmInputModule,
    ZmBsCompModule,
  ],

  entryComponents:[
  ],
  exports:[
  ],
  providers:[
    // GoodsListViewDataMgr,
  ],

})
export class AppointmentPageModule {}
