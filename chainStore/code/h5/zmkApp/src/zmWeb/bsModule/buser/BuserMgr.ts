import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppCfg} from "../../comModule/AppCfg";
import {MgrPool} from "../../comModule/MgrPool";
import {BUser} from "./data/BUser";
import {ReqMap} from "../../comModule/AppUtils";

export class BuserMgr {

  public static getInstance():BuserMgr{
    return MgrPool.getInstance().get("BuserMgr",BuserMgr);
  }

  private buserDao: BuserDao;

  constructor() {
    this.buserDao = new BuserDao();
  }

  public get(id:string):Promise<BUser>{
    return this.buserDao.get(id);
  }

  public findByMultitId(idArray:Array<string>):Promise<Array<BUser>>{
    var ids = idArray.join(",");
    var reqMap =new ReqMap().add("ids", ids);
    var findPath = "findByMultitId";
    return this.buserDao.findListWithReqParam(findPath, reqMap);
  };

}

export class BuserDao extends AsyncRestDao<BUser> {
  constructor() {
    let table = "buser";
    super(BUser, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
