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
   * 是否过期
   * @returns {boolean}
   */
  public isExpired():boolean{
    let isExpired = SessionUtil.getInstance().getIsExpired();
    if(isExpired){
      return true;
    }else{
      return false;
    }
  }

}
