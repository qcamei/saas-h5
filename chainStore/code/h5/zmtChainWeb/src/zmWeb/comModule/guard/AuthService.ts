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
    if(!AppUtils.isNullObj(userId) && !AppUtils.isNullOrWhiteSpace(accessToken)){
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
    let chainId = SessionUtil.getInstance().getChainId();
    if(!AppUtils.isNullOrWhiteSpace(chainId)){
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
    await this.permService.refreshPermData();
    let authData = new AuthData();
    return new Promise<AuthData>(resolve=>{
      resolve(authData);
    });
  }

}
