import {CommonModule} from "@angular/common";
import {ThemeModule} from "../../../app/@theme/theme.module";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../common/SharedModule/SharedModule";
import {NgModule} from "@angular/core";
import {HomePage} from "./page/home";
import {HomeRoutingModule} from "./home-routing.module";


@NgModule({
  declarations: [
    //page
    HomePage,

  ],
  imports: [
    //公共module
    CommonModule,
    FormsModule,
    ThemeModule,
    SharedModule,

    //路由module
    HomeRoutingModule,

  ],
  exports:[

  ],
  providers: [

  ]
})

export class HomeModule {
}
