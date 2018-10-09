import {Injectable} from '@angular/core';
import {ReqMap} from "../../comModule/AppUtils";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {ChainUserUpdateType} from "./apiData/ChainUserUpdateType";
import {RestResp} from "../../comModule/RestResp";
import {AppCfg} from "../../comModule/AppCfg";
import {ChainUser} from "./data/ChainUser";
import {ChainUserLoginForm} from "./apiData/ChainUserLoginForm";
import {RegistForm} from "./apiData/RegistForm";
import {ChainUserUpdateForm} from "./apiData/ChainUserUpdateForm";
import {ChainUserUpdateInfoForm} from "./apiData/ChainUserUpdateInfoForm";
import {ChangePasswordForm} from "./apiData/ChangePasswordForm";
import {ChainUserQueryForm} from "./apiData/ChainUserQueryForm";
import {ChainUserDto} from "./data/ChainUserDto";
import {PageResp} from "../../comModule/PageResp";


@Injectable()
export class ChainUserMgr {

  private chainUserDao: ChainUserDao;

  constructor(restProxy: AsyncRestProxy) {
    this.chainUserDao = new ChainUserDao(restProxy);
  }

  public getChainUser(userId:number): Promise<ChainUser> {
    return this.chainUserDao.get(userId);
  }

  //查询员工列表
  public findByCond(queryForm:ChainUserQueryForm):Promise<PageResp>{
    let reqPath = "findByCond";
    let reqMap = new ReqMap();
    let chainUserIds = "";
    if(queryForm.chainUserIds){
      chainUserIds = queryForm.chainUserIds.join(",");
    }
    let crossClerks = "";
    if(queryForm.crossClerks){
      crossClerks = queryForm.crossClerks.join(",");
    }
    reqMap.add("phoneOrName",queryForm.phoneOrName)
      .add("chainId",queryForm.chainId)
      .add("chainUserIds",chainUserIds)
      .add("crossClerks",crossClerks)
      .add("roleId",queryForm.roleId.toString())
      .add("pageNo",queryForm.pageNo.toString())
      .add("pageItemCount",queryForm.pageItemCount.toString());
    return this.chainUserDao.getPageRespByType(reqPath,reqMap,ChainUserDto);
  }


  public findByPhone(phone: string):Promise<ChainUser>{
    let uriPath = "findByPhone";
    let reqMap = new ReqMap().add("phone", phone);
    return this.chainUserDao.findOneWithReqParam(uriPath, reqMap);
  }

  public reg(regForm:RegistForm):Promise<RestResp>{
    var regPath = "reg";
    return this.chainUserDao.rawReq(regPath, regForm);
  }

  public login(loginForm:ChainUserLoginForm):Promise<RestResp> {
    var loginPath = "login";
    return this.chainUserDao.rawReq(loginPath, loginForm);
  }

  public updateInfo(chainUserId, updateInfoForm:ChainUserUpdateInfoForm):Promise<boolean> {
    var updateForm = new ChainUserUpdateForm();
    updateForm.updateType = ChainUserUpdateType.UpdateInfo;
    updateForm.chainUserUpdateInfoForm = updateInfoForm;
    return this.chainUserDao.updateWithId(chainUserId, updateForm);
  }

  public changePassword(chainUserId, changePasswordForm:ChangePasswordForm):Promise<boolean>{
    var updateForm = new ChainUserUpdateForm();
    updateForm.updateType = ChainUserUpdateType.ChangePassword;
    updateForm.changePasswordForm = changePasswordForm;
    return this.chainUserDao.updateWithId(chainUserId, updateForm);
  }

}

class ChainUserDao extends AsyncRestDao<ChainUser> {

  constructor(restProxy: AsyncRestProxy) {
    var table: string = "chainUser";
    super(ChainUser, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}


