import {BUser} from "./data/BUser";
import {BUserMgr} from "./BUserMgr";
import {AbsCacheMgr} from "../../comModule/AbsCacheMgr";
import {MgrPool} from "../../comModule/MgrPool";


export class BUserCacheMgr extends  AbsCacheMgr<BUser>{

  public static getInstance():BUserCacheMgr{
    return MgrPool.getInstance().get("BUserCacheMgr",BUserCacheMgr);
  }

  constructor() {
    super();
  }


  //覆盖父类方法
  protected getId( target:BUser ):string {
    return target.id;
  }

  //覆盖父类方法
  protected findListFromServer( idArray:Array<string> ):Promise<Array<BUser>> {

    return new Promise<Array<BUser>>(resolve => {
      BUserMgr.getInstance().findByMultitId(idArray).then(
        function (buserList) {
          resolve(buserList);
        }
      );
    });
  }

}

