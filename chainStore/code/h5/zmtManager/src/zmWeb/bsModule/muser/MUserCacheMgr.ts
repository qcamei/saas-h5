import {Injectable} from '@angular/core';
import {MUser} from "./apiData/MUser";
import {MUserMgr} from "./MUserMgr";
import {AbsCacheMgr} from "../../comModule/AbsCacheMgr";


@Injectable()
export class MUserCacheMgr extends  AbsCacheMgr<MUser>{

  constructor(private muserMgr: MUserMgr) {
    super();
  }


  //覆盖父类方法
  protected getId( target:MUser ):string {
    return target.id;
  }

  //覆盖父类方法
  protected findListFromServer( idArray:Array<string> ):Promise<Array<MUser>> {

    return new Promise<Array<MUser>>(resolve => {
      this.muserMgr.findByMultitId(idArray).then(
        function (muserList) {
          resolve(muserList);
        }
      );
    });
  }

}

