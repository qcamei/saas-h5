import {Injectable} from '@angular/core';
import {ReqMap} from "../../comModule/AppUtils";
import {SessionUtil} from "../../comModule/SessionUtil";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {BUserUpdateApiForm} from "./apiData/BUserUpdateApiForm";
import {BUserUpdateType} from "./apiData/BUserUpdateType";
import {BUser} from "./apiData/BUser";
import {RestResp} from "../../comModule/RestResp";
import {BUserVipRechargeData} from "./apiData/BUserVipRechargeData";


@Injectable()
export class BUserMgr {

  private buserDao: BUserDao;

  constructor(restProxy: AsyncRestProxy) {
    this.buserDao = new BUserDao(restProxy);
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


  public findByPhone(phone: string):Promise<BUser>{
    let uriPath = "findByPhone";
    let reqMap = new ReqMap().add("phone", phone);
    return new Promise<BUser>((resolve,reject)  => {
      this.buserDao.findOneWithReqParam(uriPath, reqMap).then(
        function (buser) {
          resolve(buser);
        }
      ).catch(
        (error)=>{
          reject(error);
        }
      );
    });
  }


  public updateVipRecharge(buserId, buserVipRechargeData:BUserVipRechargeData):Promise<boolean> {
    var buserUpdateApiForm = new BUserUpdateApiForm();
    buserUpdateApiForm.updateType = BUserUpdateType.VipRecharge;
    buserUpdateApiForm.vipRechargeData = buserVipRechargeData;
    return new Promise<boolean>(resolve => {
      this.buserDao.updateWithId(buserId, buserUpdateApiForm).then(
        function (success) {
          resolve(success);
        }
      );
    });
  }

  public reg(buserAddApiForm):Promise<RestResp>{
    var regPath = "reg";
    let daoTmp = this;
    return new Promise<RestResp>(resolve => {
      this.buserDao.rawReq(regPath, buserAddApiForm).then(
        function (restResp) {
          // let target:BUser = daoTmp.buserDao.getTarget(restResp);
          resolve(restResp);
        }
      );
    });
  }

  public login(buserLoginApiForm):Promise<RestResp> {
    var loginPath = "login";
    return new Promise<RestResp>(resolve => {
      this.buserDao.rawReq(loginPath, buserLoginApiForm).then(
          function (restResp) {
            // if(restResp != null && !AppUtils.isNullOrWhiteSpace(restResp.tJson)){
            //   let target = AppUtils.fromJson(LoginResp, restResp.tJson);
            //   resolve(target);
            // }
            resolve(restResp);
        }
      );
    });
  }

  public updateInfo(buserId, buserUpdateInfoApiData):Promise<boolean> {
    var buserUpdateApiForm = new BUserUpdateApiForm();
    buserUpdateApiForm.updateType = BUserUpdateType.updateInfo;
    buserUpdateApiForm.updateInfoData = buserUpdateInfoApiData;
    return new Promise<boolean>(resolve => {
      this.buserDao.updateWithId(buserId, buserUpdateApiForm).then(
        function (success) {
          resolve(success);
        }
      );
    });
  }

  public changePassword(buserChangePasswordApiData):Promise<boolean>{

    let updateForm = new BUserUpdateApiForm();
    let buserId = buserChangePasswordApiData.buserId;
    updateForm.updateType = BUserUpdateType.changePassword;
    updateForm.changePasswordData = buserChangePasswordApiData;
    return new Promise<boolean>(resolve => {
      this.buserDao.updateWithId(buserId, updateForm).then(
        function (successTmp) {
          resolve(successTmp);
        }
      );
    });
  }


  public findByMultitId(idArray:Array<string>):Promise<Array<BUser>>{
    var ids = idArray.join(",");
    var reqMap =new ReqMap().add("idList", ids);
    var findPath = "findByMultitId";
    return new Promise<Array<BUser>>(resolve => {
      this.buserDao.findListWithReqParam(findPath, reqMap, 100, 1).then(
        function (buserList) {
          resolve(buserList);
        }
      );
    });
  };

  public resetPwd(resetPwdForm){
    let actionName = "changePassword";
    return new Promise(resolve => {
      this.buserDao.rawReq(actionName, resetPwdForm).then(
         (restResp)=> {
           resolve(restResp);
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


