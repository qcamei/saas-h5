import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import { PrintPreviewPage } from "./printPreview/printPreview";


const mRoutes:Routes = [
  {
    path:"printPreview",
    component:PrintPreviewPage
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

export class PrintRoutingModule{}
