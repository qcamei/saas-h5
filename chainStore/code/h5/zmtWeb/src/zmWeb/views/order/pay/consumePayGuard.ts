import {CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {ConsumePayPage} from "./consumePay";

@Injectable()
export class ConsumePayGuard implements CanDeactivate<ConsumePayPage>{
  canDeactivate(component: ConsumePayPage, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {
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
