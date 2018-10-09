import {Injectable} from '@angular/core';
import {ReqMap} from "../../comModule/AppUtils";
import {SessionUtil} from "../../comModule/SessionUtil";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {MUserUpdateApiForm} from "./apiData/MUserUpdateApiForm";
import {MUserUpdateType} from "./apiData/MUserUpdateType";
import {MUser} from "./apiData/MUser";
import {RestResp} from "../../comModule/RestResp";


@Injectable()
export class MUserMgr {

  private muserDao: MUserDao;

  constructor(restProxy: AsyncRestProxy) {
    console.log('Hello StoreProvider Provider');
    this.muserDao = new MUserDao(restProxy);
  }

  public getMUser(id: String): Promise<MUser> {

    return new Promise<MUser>(resolve => {
      this.muserDao.get(id).then(
        function (muser) {
          resolve(muser);
        }
      );
    });
  }


  public findByPhone(phone: string):Promise<MUser>{
    let uriPath = "findByPhone";
    let reqMap = new ReqMap().add("phone", phone);
    return new Promise<MUser>(resolve => {
      this.muserDao.findOneWithReqParam(uriPath, reqMap).then(
        function (muser) {
          resolve(muser);
        }
      );
    });
  }

  public reg(muserAddApiForm):Promise<RestResp>{
    var regPath = "reg";
    let daoTmp = this;
    return new Promise<RestResp>(resolve => {
      this.muserDao.rawReq(regPath, muserAddApiForm).then(
        function (restResp) {
          // let target:MUser = daoTmp.muserDao.getTarget(restResp);
          resolve(restResp);
        }
      );
    });
  }

  public login(muserLoginApiForm):Promise<RestResp> {
    var loginPath = "login";
    return new Promise<RestResp>(resolve => {
      this.muserDao.rawReq(loginPath, muserLoginApiForm).then(
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

  public updateInfo(muserId, muserUpdateInfoApiData):Promise<boolean> {
    var muserUpdateApiForm = new MUserUpdateApiForm();
    muserUpdateApiForm.updateType = MUserUpdateType.updateInfo;
    muserUpdateApiForm.updateInfoData = muserUpdateInfoApiData;
    return new Promise<boolean>(resolve => {
      this.muserDao.updateWithId(muserId, muserUpdateApiForm).then(
        function (success) {
          resolve(success);
        }
      );
    });
  }

  public changePassword(muserChangePasswordApiData):Promise<boolean>{

    let updateForm = new MUserUpdateApiForm();
    let muserId = muserChangePasswordApiData.muserId;
    updateForm.updateType = MUserUpdateType.changePassword;
    updateForm.changePasswordData = muserChangePasswordApiData;
    return new Promise<boolean>(resolve => {
      this.muserDao.updateWithId(muserId, updateForm).then(
        function (successTmp) {
          resolve(successTmp);
        }
      );
    });
  }


  public findByMultitId(idArray:Array<string>):Promise<Array<MUser>>{
    var ids = idArray.join(",");
    var reqMap =new ReqMap().add("idList", ids);
    var findPath = "findByMultitId";
    return new Promise<Array<MUser>>(resolve => {
      this.muserDao.findListWithReqParam(findPath, reqMap, 100, 1).then(
        function (muserList) {
          resolve(muserList);
        }
      );
    });
  };

  public resetPwd(resetPwdForm){
    let actionName = "changePassword";
    return new Promise(resolve => {
      this.muserDao.rawReq(actionName, resetPwdForm).then(
         (restResp)=> {
           resolve(restResp);
         }
      );
    });
  }

}

class MUserDao extends AsyncRestDao<MUser> {

  constructor(restProxy: AsyncRestProxy) {
    var table: string = "muser";
    super(MUser, restProxy, table);
  }

  getService(): string {
    return SessionUtil.getInstance().getServiceAddress();
  }
}


