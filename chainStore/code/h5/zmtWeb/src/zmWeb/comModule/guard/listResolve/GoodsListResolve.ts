import {Injectable} from "@angular/core";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {StoreGoodsListViewData} from "../../../views/storeGoods/storeGoodsList/storeGoodsList";
@Injectable()
export class GoodsListResolve implements Resolve<any> {

  constructor() {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): void {
    let arr = document.URL.split("#")[1].split("/");
    if ("storeGoods" != arr[2]) {
      StoreGoodsListViewData.getInstance().initData();
    }
  }
}
