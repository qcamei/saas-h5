import {ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate} from "@angular/router";
import {Observable} from "rxjs";
import {AppUtils} from "../../../comModule/AppUtils";
import {Injectable} from "@angular/core";
import {AuthService} from "../../../comModule/guard/AuthService";
import {ExpiredPage} from "./expired";

/**
 * 过期验证
 */
@Injectable()
export class ExpiredGuard implements CanDeactivate<ExpiredPage>{

  constructor(private authService:AuthService){}

  canDeactivate(component: ExpiredPage, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {
    if(nextState.url == "/login" || (nextState.url == "/main/charge/vipCharge" && component.viewData.showPage == 1)){
      return true;
    }
    if(!component.viewData.isExpired){
      return true;
    }else{
      if(component.viewData.showPage == 0){
        AppUtils.showWarn("提示","尚未开通会员，请先开通");
      }else{
        AppUtils.showWarn("提示","会员过期,请联系客服");
      }
      return false;
    }
  }
}
