import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {BUserRole} from "./data/BuserRole";
import {Injectable} from "@angular/core";
import {AppCfg} from "../../comModule/AppCfg";

@Injectable()
export class BUserRoleMgr {

  private buserRoleDao: BUserRoleDao;

  constructor(restProxy: AsyncRestProxy) {
    this.buserRoleDao = new BUserRoleDao(restProxy);
  }

  //bossId
  public getBUserRole(buserId: String): Promise<BUserRole> {
    return this.buserRoleDao.get(buserId);
  }


}

class BUserRoleDao extends AsyncRestDao<BUserRole> {

  constructor(restProxy: AsyncRestProxy) {
    var table: string = "buserRole";
    super(BUserRole, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
