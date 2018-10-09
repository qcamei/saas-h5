import {CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {AppUtils} from "../../comModule/AppUtils";
import {RechargePage} from "./storeRecharge/recharge";
import {Popup} from "../common/popup/popup";

@Injectable()
export class RechargeUnsettledGuard implements CanDeactivate<RechargePage>{
  canDeactivate(component: RechargePage, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {
    if(nextState.url.indexOf("/main/storeFlow/recharge/") > -1){
      return false;
    }
    if(!AppUtils.isNullObj(component.wfDataWraper)
      && !AppUtils.isNullObj(component.wfDataWraper.getCuserWFCompData().selectLeaguer)
      && !AppUtils.isNullOrWhiteSpace(component.wfDataWraper.getCuserWFCompData().selectLeaguer.id)){
      let hasSettled = component.wfDataWraper.getOrderWFCompData().hasSettled;
      if(!hasSettled){
        return this.hasSettled();
      }
    }
    return true;
  }

  private async hasSettled():Promise<boolean>{
    return new Promise<boolean>(resolve=>{
      Popup.getInstance().open("提示","充值还未完成，确定要离开该页面吗？",() =>{
        resolve(true);
      },()=> {
        resolve(false);
      })
    })
  }
}
