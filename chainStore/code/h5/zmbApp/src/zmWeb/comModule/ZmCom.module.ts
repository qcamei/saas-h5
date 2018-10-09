import {NgModule} from '@angular/core';
import {AsyncRestProxy} from "./asynDao/AsyncRestProxy";
import {HttpClientModule} from "@angular/common/http";
import {HttpClient} from "@angular/common/http";


@NgModule({
  declarations: [],
  imports: [
    HttpClientModule
  ],
  providers: [
    AsyncRestProxy,
  ]
})
export class ZmComModule {
  constructor(http: HttpClient){
    AsyncRestProxy.getInstance().init(http);
  }

}
