import {NgModule} from "@angular/core";
import {LeaguerCardEnumPipe} from "./pipe/leaguerCardEnumPipe";
import {ProductTypePipe} from "./pipe/ProdcutTypePipe";
import {AppointmentStatusPipe} from "./pipe/AppointmentStatusPipe";
import {AppointOriginTypePipe} from "./pipe/AppointOriginTypePipe";
import {OrderPayTypePipe} from "./pipe/OrderPayTypePipe";


@NgModule({
  declarations:[
    LeaguerCardEnumPipe,
    ProductTypePipe,
    AppointmentStatusPipe,
    AppointOriginTypePipe,
    OrderPayTypePipe,
  ],
  imports:[

  ],
  exports: [
    LeaguerCardEnumPipe,
    ProductTypePipe,
    AppointmentStatusPipe,
    AppointOriginTypePipe,
    OrderPayTypePipe,

  ],
})

export class SharedModule {}
