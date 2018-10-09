import { NgModule } from '@angular/core';
import {MUserMgr} from "./MUserMgr";
import {MUserSynDataHolder} from "./MUserSynDataHolder";
import {MUserCacheMgr} from "./MUserCacheMgr";
import {MUserResetPwdMgr} from "./MUserResetPwdMgr";



@NgModule({
  declarations: [

  ],
  imports: [

  ],
  providers:[
    MUserMgr,
    MUserCacheMgr,
    MUserResetPwdMgr,
    MUserSynDataHolder
  ],
  exports:[

  ]
})
export class MUserBSModule {}
