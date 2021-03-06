import {Injectable} from '@angular/core';
import {ReqMap} from "../../comModule/AppUtils";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {BUserUpdateApiForm} from "./apiData/BUserUpdateApiForm";
import {BUserUpdateType} from "./apiData/BUserUpdateType";
import {BUser} from "./apiData/BUser";
import {RestResp} from "../../comModule/RestResp";
import {BUserLoginApiForm} from "./apiData/BUserLoginApiForm";
import {AppCfg} from "../../comModule/AppCfg";


@Injectable()
export class BUserMgr {

  private buserDao: BUserDao;

  constructor(restProxy: AsyncRestProxy) {
    this.buserDao = new BUserDao(restProxy);
  }

  public getBUser(id: String): Promise<BUser> {
    return this.buserDao.get(id);
  }


  public findByPhone(phone: string):Promise<BUser>{
    let uriPath = "findByPhone";
    let reqMap = new ReqMap().add("phone", phone);
    return this.buserDao.findOneWithReqParam(uriPath, reqMap);
  }

  public reg(buserAddApiForm):Promise<RestResp>{
    var regPath = "reg";
    return this.buserDao.rawReq(regPath, buserAddApiForm);
  }

  public login(buserLoginApiForm):Promise<RestResp> {
    var loginPath = "login";
    return this.buserDao.rawReq(loginPath, buserLoginApiForm);
  }

  public updateInfo(buserId, buserUpdateInfoApiData):Promise<boolean> {
    var buserUpdateApiForm = new BUserUpdateApiForm();
    buserUpdateApiForm.updateType = BUserUpdateType.updateInfo;
    buserUpdateApiForm.updateInfoData = buserUpdateInfoApiData;
    return this.buserDao.updateWithId(buserId, buserUpdateApiForm);
  }

  public changePassword(buserChangePasswordApiData):Promise<boolean>{
    let updateForm = new BUserUpdateApiForm();
    let buserId = buserChangePasswordApiData.buserId;
    updateForm.updateType = BUserUpdateType.changePassword;
    updateForm.changePasswordData = buserChangePasswordApiData;
    return this.buserDao.updateWithId(buserId, updateForm);
  }

  public findByMultitId(idArray:Array<string>):Promise<Array<BUser>>{
    var ids = idArray.join(",");
    var reqMap =new ReqMap().add("idList", ids);
    var findPath = "findByMultitId";
    return this.buserDao.findListWithReqParam(findPath, reqMap, idArray.length, 1);
  };

  public resetPwd(resetPwdForm):Promise<RestResp>{
    let actionName = "changePassword";
    return this.buserDao.rawReq(actionName, resetPwdForm);
  }

  public findDevUserList(pageItemCount,pageNo):Promise<Array<BUser>>{
    let findPath = "findDevUserList";
    return this.buserDao.findList(findPath,pageItemCount,pageNo);
  }

  public loginWithTestPhone(buserLoginApiForm:BUserLoginApiForm):Promise<RestResp>{
    let findPath = "loginWithTestPhone";
    return this.buserDao.rawReq(findPath,buserLoginApiForm);
  }

}

class BUserDao extends AsyncRestDao<BUser> {

  constructor(restProxy: AsyncRestProxy) {
    var table: string = "buser";
    super(BUser, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}


