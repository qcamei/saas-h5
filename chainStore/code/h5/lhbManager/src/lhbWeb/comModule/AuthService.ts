import {SessionUtil} from "./SessionUtil";
import {AppUtils} from "./AppUtils";
import {Injectable} from "@angular/core";

@Injectable()
export class AuthService{

  /**
   * 是否已登录
   * @returns {boolean}
   */
  public isLogin():boolean{
    let opuserId = SessionUtil.getInstance().getOPUserId();
    let accessToken = SessionUtil.getInstance().getAccessToken();
    if(!AppUtils.isNullOrWhiteSpace(opuserId+"") && !AppUtils.isNullOrWhiteSpace(accessToken)){
      return true;
    }else{
      return false;
    }
  }


}
