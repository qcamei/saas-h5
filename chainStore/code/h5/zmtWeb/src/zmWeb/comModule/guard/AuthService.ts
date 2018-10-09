import {SessionUtil} from "../session/SessionUtil";
import {AppUtils} from "../AppUtils";
import {Injectable} from "@angular/core";
import {AuthData} from "./AuthData";
import {PermService} from "../../views/permService";

@Injectable()
export class AuthService{

  constructor(private permService:PermService){}

  /**
   * 是否已登录
   * @returns {boolean}
   */
  public isLogin():boolean{
    let userId = SessionUtil.getInstance().getUserId();
    let accessToken = SessionUtil.getInstance().getAccessToken();
    if(!AppUtils.isNullOrWhiteSpace(userId) && !AppUtils.isNullOrWhiteSpace(accessToken)){
      return true;
    }else{
      return false;
    }
  }

  /**
   * 是否有店铺
   * @returns {boolean}
   */
  public hasStore():boolean{
    let storeId = SessionUtil.getInstance().getStoreId();
    if(!AppUtils.isNullOrWhiteSpace(storeId)){
      return true;
    }else{
      return false;
    }
  }

  /**
   * 获取依赖数据
   * @returns {Promise<void>}
   */
  public async getAuthData():Promise<AuthData>{
    if(!SessionUtil.getInstance().isReload()){
      await this.permService.resolveData();
    }
    let authData = new AuthData();
    return new Promise<AuthData>(resolve=>{
      resolve(authData);
    });
  }

}
