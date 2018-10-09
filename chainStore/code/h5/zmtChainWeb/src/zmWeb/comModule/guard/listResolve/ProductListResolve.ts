import {Injectable} from "@angular/core";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {ProductInfoListViewData} from "../../../views/chainProduct/productInfo/productInfoList/ProductInfoListViewData";
@Injectable()
export class ProductListResolve implements Resolve<any> {

  constructor() {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): void {
    let arr = document.URL.split("#")[1].split("/");
    if ("chainProduct" != arr[2]) {
      ProductInfoListViewData.getInstance().initData();
    }
  }
}
