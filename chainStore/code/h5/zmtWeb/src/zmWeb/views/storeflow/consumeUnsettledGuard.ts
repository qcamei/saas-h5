import {CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {ConsumePage} from "./storeConsume/consume";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {AppUtils} from "../../comModule/AppUtils";
import {Popup} from "../common/popup/popup";

@Injectable()
export class ConsumeUnsettledGuard implements CanDeactivate<ConsumePage>{
  canDeactivate(component: ConsumePage, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {
    if(nextState.url.indexOf("/main/storeFlow/consume/") > -1){
      return false;
    }
    if(!AppUtils.isNullObj(component.wFDataWraper)
      && !AppUtils.isNullObj(component.wFDataWraper.getCuserWFCompData().selectLeaguer)
      && !AppUtils.isNullOrWhiteSpace(component.wFDataWraper.getCuserWFCompData().selectLeaguer.id)){
      let hasSettled = component.wFDataWraper.getOrderWFCompData().hasSettled;
      if(!hasSettled){
        return component.showSavePopup();
      }
    }
    return true;
  }

  private async hasSettled():Promise<boolean>{
    return new Promise<boolean>(resolve=>{
      Popup.getInstance().open("提示","该流程还未结算，确定要离开该页面吗？",() =>{
        resolve(true);
      },()=> {
        resolve(false);
      })
    })
  }
}
