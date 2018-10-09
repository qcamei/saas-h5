import {NgModule} from "@angular/core";
import {LeaguerCardEnumPipe} from "./pipe/leaguerCardEnumPipe";
import {ProductTypePipe} from "./pipe/ProdcutTypePipe";
import {AppointmentStatusPipe} from "./pipe/AppointmentStatusPipe";
import {AppointOriginTypePipe} from "./pipe/AppointOriginTypePipe";


@NgModule({
  declarations:[
    LeaguerCardEnumPipe,
    ProductTypePipe,
    AppointmentStatusPipe,
    AppointOriginTypePipe,
  ],
  imports:[

  ],
  exports: [
    LeaguerCardEnumPipe,
    ProductTypePipe,
    AppointmentStatusPipe,
    AppointOriginTypePipe,

  ],
})

export class SharedModule {}
