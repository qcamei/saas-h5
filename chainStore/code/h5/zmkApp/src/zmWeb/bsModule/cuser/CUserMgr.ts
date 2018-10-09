import {ReqMap, AppUtils} from "../../comModule/AppUtils";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {CUserUpdateApiForm} from "./apiData/CUserUpdateApiForm";
import {CUserUpdateType} from "./apiData/CUserUpdateType";
import {CUser} from "./data/CUser";
import {RestResp} from "../../comModule/asynDao/apiData/RestResp";
import {AppCfg} from "../../comModule/AppCfg";
import {MainData} from "../../comModule/session/SessionData";
import {MgrPool} from "../../comModule/MgrPool";
import {CUserAddApiForm} from "./apiData/CUserAddApiForm";
import {CUserLoginApiForm} from "./apiData/CUserLoginApiForm";
import {CUserLoginByCodeApiForm} from "./apiData/CUserLoginByCodeApiForm";
import {CUserAddressAddForm} from "./apiData/CUserAddressAddForm";
import {CUserAddressUpdateForm} from "./apiData/CUserAddressUpdateForm";
import {CUserAddressRemoveForm} from "./apiData/CUserAddressRemoveForm";
import {CUserChangeDefaultAddressForm} from "./apiData/CUserChangeDefaultAddressForm";


export class CUserMgr {

  public static getInstance():CUserMgr{
    return MgrPool.getInstance().get("CUserMgr",CUserMgr);
  }

  private cuserDao: CUserDao;

  constructor() {
    this.cuserDao = new CUserDao();
  }

  public getCUser(id: String): Promise<CUser> {
    return this.cuserDao.get(id);
  }

  public findByPhone(phone: string):Promise<CUser>{
    let uriPath = "findByPhone";
    let reqMap = new ReqMap().add("phone", phone);
    return this.cuserDao.findOneWithReqParam(uriPath, reqMap);
  }

  public reg(cuserAddApiForm:CUserAddApiForm):Promise<RestResp>{
    let regPath = "reg";
    return this.cuserDao.rawReq(regPath, cuserAddApiForm);
  }

  public login(cuserLoginApiForm:CUserLoginApiForm):Promise<RestResp> {
    let loginPath = "login";
    return this.cuserDao.rawReq(loginPath, cuserLoginApiForm);
  }

  public loginByCode(cuserLoginByCodeApiForm:CUserLoginByCodeApiForm):Promise<RestResp> {
    let loginPath = "loginByCode";
    return this.cuserDao.rawReq(loginPath, cuserLoginByCodeApiForm);
  }

  public updateInfo(cuserId, cuserUpdateInfoApiData):Promise<boolean> {
    let cuserUpdateApiForm = new CUserUpdateApiForm();
    cuserUpdateApiForm.updateType = CUserUpdateType.UpdateInfo;
    cuserUpdateApiForm.updateInfoData = cuserUpdateInfoApiData;
    return this.cuserDao.updateWithId(cuserId, cuserUpdateApiForm);
  }

  public addAddress(cuserId, cuserAddressAddData: CUserAddressAddForm):Promise<boolean> {
    let cuserUpdateApiForm = new CUserUpdateApiForm();
    cuserUpdateApiForm.updateType = CUserUpdateType.AddAddress;
    cuserUpdateApiForm.addressAddData = cuserAddressAddData;
    return this.cuserDao.updateWithId(cuserId, cuserUpdateApiForm);
  }

  public updateAddress(cuserId, cuserAddressUpdateData: CUserAddressUpdateForm):Promise<boolean> {
    let cuserUpdateApiForm = new CUserUpdateApiForm();
    cuserUpdateApiForm.updateType = CUserUpdateType.UpdateAddress;
    cuserUpdateApiForm.addressUpdateData = cuserAddressUpdateData;
    return this.cuserDao.updateWithId(cuserId, cuserUpdateApiForm);
  }

  public removeAddress(cuserId, cuserAddressRemoveData: CUserAddressRemoveForm):Promise<boolean> {
    let cuserUpdateApiForm = new CUserUpdateApiForm();
    cuserUpdateApiForm.updateType = CUserUpdateType.RemoveAddress;
    cuserUpdateApiForm.addressRemoveData = cuserAddressRemoveData;
    return this.cuserDao.updateWithId(cuserId, cuserUpdateApiForm);
  }

  /**
   * 如果在地址列表页面设置默认地址，使用此方法
   * @param cuserId
   * @param {CUserAddressRemoveForm} cuserAddressRemoveData
   * @returns {Promise<boolean>}
   */
  public changeDefaultAddress(cuserId, cuserChangeDefaultAddressData: CUserChangeDefaultAddressForm):Promise<boolean> {
    let cuserUpdateApiForm = new CUserUpdateApiForm();
    cuserUpdateApiForm.updateType = CUserUpdateType.ChangeDefaultAddress;
    cuserUpdateApiForm.changeDefaultAddressData = cuserChangeDefaultAddressData;
    return this.cuserDao.updateWithId(cuserId, cuserUpdateApiForm);
  }

  public changePassword(cuserChangePasswordApiData):Promise<boolean>{
    let updateForm = new CUserUpdateApiForm();
    let cuserId = cuserChangePasswordApiData.cuserId;
    updateForm.updateType = CUserUpdateType.ChangePassword;
    updateForm.changePasswordData = cuserChangePasswordApiData;
    return this.cuserDao.updateWithId(cuserId, updateForm);
  }

  public findByListId(idArray:Array<string>):Promise<Array<CUser>>{
    let ids = idArray.join(",");
    let reqMap =new ReqMap().add("ids", ids);
    let findPath = "findByListId";
    return this.cuserDao.findListWithReqParam(findPath, reqMap);
  };

  public resetPwd(resetPwdForm){
    let actionName = "changePassword";
    return this.cuserDao.rawReq(actionName, resetPwdForm);
  }


  public reqMainData(cuserId:string, curWUnitId:string):Promise<MainData>{

    let actionPattern = "mainData/{0}/{1}";
    let actionName = AppUtils.format(actionPattern, cuserId, curWUnitId);

    return new Promise(resolve => {
      this.cuserDao.rawReq(actionName, null).then(
        (restResp:RestResp)=> {
          if (restResp!=null && !AppUtils.isNullOrWhiteSpace(restResp.tJson)) {
            let target:MainData = AppUtils.fromJson(MainData, restResp.tJson);
            resolve(target);
          }else{
            resolve(null);
          }
        }
      );
    });
  }

}



class CUserDao extends AsyncRestDao<CUser> {

  constructor() {
    let table: string = "cuser";
    super(CUser, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
