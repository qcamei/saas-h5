import {Injectable} from '@angular/core';
import {ReqMap} from "../../comModule/AppUtils";
import {SessionUtil} from "../../comModule/SessionUtil";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {BUserUpdateApiForm} from "./apiData/BUserUpdateApiForm";
import {BUserUpdateType} from "./apiData/BUserUpdateType";
import {BUser} from "./apiData/BUser";
import {BUserUpdateInfoData} from "./apiData/BUserUpdateInfoData";
import {BUserUpdateIntegralData} from "./apiData/BUserUpdateIntegralData";
import {BUserAddApiForm} from "./apiData/BUserAddApiForm";


@Injectable()
export class BUserMgr {

  private buserDao: BUserDao;

  constructor(restProxy: AsyncRestProxy) {
    this.buserDao = new BUserDao(restProxy);
  }

  public addBUser(buserAddForm: BUserAddApiForm): Promise<BUser> {

    let findPath = "add";
    return new Promise<BUser>(resolve => {
      this.buserDao.addFormByCond(buserAddForm,findPath).then(
        function (buser) {
          resolve(buser);
        }
      );
    });
  }

  public getBUser(id: String): Promise<BUser> {

    return new Promise<BUser>(resolve => {
      this.buserDao.get(id).then(
        function (buser) {
          resolve(buser);
        }
      );
    });
  }

  public getBUserList(): Promise<Array<BUser>> {
    let findPath = "/findBUserList";
    let pageItemCount = -1;
    let pageNo = 1;

    return new Promise<Array<BUser>>(resolve => {
      this.buserDao.findList(findPath,pageItemCount,pageNo).then(
        function (buserList) {
          resolve(buserList);
        }
      );
    });
  }

  public deleteBUser(id: String): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.buserDao.delete(id).then(
        function (success) {
          resolve(success);
        }
      );
    });
  }



  public updateInfo(buserId, updateInfoApiData:BUserUpdateInfoData):Promise<boolean> {
    var buserUpdateApiForm = new BUserUpdateApiForm();
    buserUpdateApiForm.updateType = BUserUpdateType.updateInfo;
    buserUpdateApiForm.updateInfoData = updateInfoApiData;
    return new Promise<boolean>(resolve => {
      this.buserDao.updateWithId(buserId, buserUpdateApiForm).then(
        function (success) {
          resolve(success);
        }
      );
    });
  }

  public updateIntegral(openId, updateIntegralApiData:BUserUpdateIntegralData):Promise<boolean> {
    var buserUpdateApiForm = new BUserUpdateApiForm();
    buserUpdateApiForm.updateType = BUserUpdateType.updateIntegral;
    buserUpdateApiForm.updateIntegralData = updateIntegralApiData;
    return new Promise<boolean>(resolve => {
      this.buserDao.updateWithId(openId, buserUpdateApiForm).then(
        function (success) {
          resolve(success);
        }
      );
    });
  }
}

class BUserDao extends AsyncRestDao<BUser> {

  constructor(restProxy: AsyncRestProxy) {
    var table: string = "buser";
    super(BUser, restProxy, table);
  }

  getService(): string {
    return SessionUtil.getInstance().getServiceAddress();
  }
}


