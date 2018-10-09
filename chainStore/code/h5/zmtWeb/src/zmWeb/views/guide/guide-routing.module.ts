
import {GuidePage} from "./guide/guide";
import {Routes, RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";

const mRoutes: Routes = [
  {
    path: 'guide',
    component: GuidePage,
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
export class GuideRoutingModule {
}
