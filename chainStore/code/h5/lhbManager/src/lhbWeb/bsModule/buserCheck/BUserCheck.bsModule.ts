import { NgModule } from '@angular/core';
import {BUserCheckMgr} from "./BUserCheckMgr";
import {BUserCheckViewDataMgr} from "../../views/buserCheck/BUserCheckViewDataMgr";



@NgModule({
  declarations: [

  ],
  imports: [

  ],
  providers:[
    BUserCheckMgr,
    BUserCheckViewDataMgr,
  ],
  exports:[

  ]
})
export class BUserCheckBSModule {}
