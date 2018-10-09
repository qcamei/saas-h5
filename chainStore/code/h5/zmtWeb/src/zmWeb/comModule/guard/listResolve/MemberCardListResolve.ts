import {Injectable} from "@angular/core";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {MemberCardListViewData} from "../../../views/storeCardInfo/memberCard/memberCardList/memberCardList";
@Injectable()
export class MemberCardListResolve implements Resolve<any> {

  constructor() {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): void {
    let arr = document.URL.split("#")[1].split("/");
    if ("storeCardInfo" != arr[2] || "memberCard" != arr[3]) {
      MemberCardListViewData.getInstance().initData();
    }
  }
}
