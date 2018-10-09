import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {SessionUtil} from "../../comModule/SessionUtil";
import {BUserRole} from "./data/BuserRole";
import {Injectable} from "@angular/core";
import {BuserRoleUpdateInfoForm} from "./apiData/BuserRoleUpdateInfoForm";
import {BuserRoleUpdateApiForm} from "./apiData/BuserRoleUpdateApiForm";
import {BuserRoleUpdateType} from "./apiData/BuserRoleUpdateType";

@Injectable()
export class BUserRoleMgr {

  private buserRoleDao: BUserRoleDao;

  constructor(restProxy: AsyncRestProxy) {
    this.buserRoleDao = new BUserRoleDao(restProxy);
  }

  public getBUserRole(buserId: String): Promise<BUserRole> {
    return this.buserRoleDao.get(buserId);
  }

  public updateInfo(buserId, updateInfoForm:BuserRoleUpdateInfoForm):Promise<boolean> {
    var updateForm = new BuserRoleUpdateApiForm();
    updateForm.updateType = BuserRoleUpdateType.UpdateInfo;
    updateForm.updateInfoData = updateInfoForm;
    return new Promise<boolean>(resolve => {
      this.buserRoleDao.updateWithId(buserId, updateForm).then(
        function (success) {
          resolve(success);
        }
      );
    });
  }

}

class BUserRoleDao extends AsyncRestDao<BUserRole> {

  constructor(restProxy: AsyncRestProxy) {
    var table: string = "buserRole";
    super(BUserRole, restProxy, table);
  }

  getService(): string {
    return SessionUtil.getInstance().getServiceAddress();
  }
}
