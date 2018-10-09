import {Injectable} from "@angular/core";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";

@Injectable()
export class AppointmentListResolve implements Resolve<any> {

  constructor() {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): void {
    // let arr = document.URL.split("#")[1].split("/");
    // if ("appointment" != arr[2]) {
    //   AppointmentListViewData.getInstance().initData();
    // }
  }
}
