import {CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {ConsumePayPage} from "./consumePay";
import {RechargePayPage} from "./rechargePay";

@Injectable()
export class RechargePayGuard implements CanDeactivate<RechargePayPage>{
  canDeactivate(component: RechargePayPage, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {
    if(nextState.url.indexOf("/main/order/consumePay/") > -1){
      return false;
    }
    let hasPay = component.viewData.hasPay;
    if(!hasPay){
      return component.showUnPayPopup();
    }
    return true;
  }

}
