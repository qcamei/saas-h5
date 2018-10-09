import {Injectable} from '@angular/core';
import {BUser} from "./apiData/BUser";
import {BUserMgr} from "./BUserMgr";
import {AbsCacheMgr} from "../../comModule/AbsCacheMgr";


@Injectable()
export class BUserCacheMgr extends  AbsCacheMgr<BUser>{

  constructor(private buserMgr: BUserMgr) {
    super();
  }


  //覆盖父类方法
  protected getId( target:BUser ):string {
    return target.id;
  }

  //覆盖父类方法
  protected findListFromServer( idArray:Array<string> ):Promise<Array<BUser>> {

    return new Promise<Array<BUser>>(resolve => {
      this.buserMgr.findByMultitId(idArray).then(
        function (buserList) {
          resolve(buserList);
        }
      );
    });
  }

}

