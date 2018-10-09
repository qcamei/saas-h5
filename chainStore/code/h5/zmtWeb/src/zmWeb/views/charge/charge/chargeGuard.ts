import {ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate} from "@angular/router";
import {Observable} from "rxjs";
import {AppUtils} from "../../../comModule/AppUtils";
import {Injectable} from "@angular/core";
import {ChargePage} from "./charge";

/**
 * 续费升级过期验证
 */
@Injectable()
export class ChargeGuard implements CanDeactivate<ChargePage>{

  canDeactivate(component: ChargePage, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {
    if(nextState.url == "/login"){
      return true;
    }
    let curTime = new Date().getTime();
    if (component.viewData.buser && component.viewData.buser.expiredTime && component.viewData.buser.expiredTime > curTime) {
      return true;
    }
    AppUtils.showWarn("提示","会员过期,请联系客服");
    return false;
  }

}
