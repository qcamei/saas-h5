import {Injectable} from "@angular/core";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {ProductCardListViewData} from "../../../views/storeCardInfo/productCard/productCardList/productCardList";
@Injectable()
export class ProductCardListResolve implements Resolve<any> {

  constructor() {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): void {
    let arr = document.URL.split("#")[1].split("/");
    if ("storeCardInfo" != arr[2] || "productCard" != arr[3]) {
      ProductCardListViewData.getInstance().initData();
    }
  }
}
