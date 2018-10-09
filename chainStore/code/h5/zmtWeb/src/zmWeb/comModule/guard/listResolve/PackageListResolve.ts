import {Injectable} from "@angular/core";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {PackageListViewData} from "../../../views/storePackageProject/packageProject/packageList/packageList";

@Injectable()
export class PackageListResolve implements Resolve<any> {

  constructor() {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): void {
    let arr = document.URL.split("#")[1].split("/");
    if ("storePackageProject" != arr[2]) {
      PackageListViewData.getInstance().initData();
    }
  }
}
