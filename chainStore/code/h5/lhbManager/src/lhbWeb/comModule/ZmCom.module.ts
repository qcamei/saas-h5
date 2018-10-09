import {NgModule} from '@angular/core';
import {HttpModule} from "@angular/http";
import {AsyncRestProxy} from "./asynDao/AsyncRestProxy";
// import {BsDropdownModule} from "ngx-bootstrap";


@NgModule({
  declarations: [],
  imports: [
    HttpModule

    // BsDropdownModule.forRoot(),
  ],
  providers: [
    AsyncRestProxy
  ]
})
export class ZmComModule {

}
