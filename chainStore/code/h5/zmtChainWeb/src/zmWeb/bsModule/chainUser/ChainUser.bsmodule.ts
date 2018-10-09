import { NgModule } from '@angular/core';
import {ChainUserMgr} from "./ChainUserMgr";
import {ChainUserSynDataHolder} from "./ChainUserSynDataHolder";
import {ChainUserResetPwdMgr} from "./ChainUserResetPwdMgr";



@NgModule({
  declarations: [

  ],
  imports: [

  ],
  providers:[
    ChainUserMgr,
    ChainUserResetPwdMgr,
    ChainUserSynDataHolder
  ],
  exports:[

  ]
})
export class ChainUserBSModule {}
