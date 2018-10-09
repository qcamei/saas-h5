import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, RouterStateSnapshot, Resolve} from "@angular/router";
import {SessionUtil} from "../session/SessionUtil";
import {AppUtils} from "../AppUtils";
import {AppRouter} from "../AppRouter";

@Injectable()
export class LeaguerResolve implements Resolve<any>{

  constructor(){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):void {

    let userPremData = SessionUtil.getInstance().getUserPermData();
    if (!userPremData.isLeaguerAdmin) {
      AppUtils.showWarn("提示","抱歉，您没有会员管理权限，如有疑问，请联系客服咨询。");
      AppRouter.goHome();
    }
  }
}
