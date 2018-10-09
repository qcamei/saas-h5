import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {BUserRole} from "./data/BuserRole";
import {AppCfg} from "../../comModule/AppCfg";
import {MgrPool} from "../../comModule/MgrPool";



export class BUserRoleMgr {

  public static getInstance():BUserRoleMgr{
    return MgrPool.getInstance().get("BUserRoleMgr",BUserRoleMgr);
  }

  private buserRoleDao: BUserRoleDao;

  constructor() {
    this.buserRoleDao = new BUserRoleDao();
  }

  //bossId
  public getBUserRole(buserId: String): Promise<BUserRole> {
    return this.buserRoleDao.get(buserId);
  }


}

class BUserRoleDao extends AsyncRestDao<BUserRole> {

  constructor() {
    var table: string = "buserRole";
    super(BUserRole, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
