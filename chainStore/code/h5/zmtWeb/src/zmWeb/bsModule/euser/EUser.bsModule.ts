import { NgModule } from '@angular/core';
import {EUserMgr} from "./EUserMgr";
import {EUserSynDataHolder} from "./EUserSynDataHolder";


@NgModule({
  declarations: [

  ],
  imports: [

  ],
  providers:[
    EUserMgr,
    EUserSynDataHolder,
  ],
  exports:[

  ]
})
export class EUserBSModule {}
