import { NgModule } from '@angular/core';
import {BUserMgr} from "./BUserMgr";
import {BUserSynDataHolder} from "./BUserSynDataHolder";
import {BUserCacheMgr} from "./BUserCacheMgr";
import {BUserResetPwdMgr} from "./BUserResetPwdMgr";



@NgModule({
  declarations: [

  ],
  imports: [

  ],
  providers:[
    BUserMgr,
    BUserCacheMgr,
    BUserResetPwdMgr,
    BUserSynDataHolder
  ],
  exports:[

  ]
})
export class BUserBSModule {}
