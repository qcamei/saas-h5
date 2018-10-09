import { NgModule } from '@angular/core';
import {BUserMgr} from "./BUserMgr";
import {BUserViewDataMgr} from "../../views/buser/BUserViewDataMgr";



@NgModule({
  declarations: [

  ],
  imports: [

  ],
  providers:[
    BUserMgr,
    BUserViewDataMgr,
  ],
  exports:[

  ]
})
export class BUserBSModule {}
