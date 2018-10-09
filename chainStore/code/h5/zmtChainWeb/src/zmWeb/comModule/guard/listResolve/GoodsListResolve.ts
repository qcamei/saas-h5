import {Injectable} from "@angular/core";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {ChainGoodsListViewData} from "../../../views/chainGoods/goodsList/GoodsList";
@Injectable()
export class GoodsListResolve implements Resolve<any> {

  constructor() {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): void {
    let arr = document.URL.split("#")[1].split("/");
    if ("chainGoods" != arr[2]) {
      ChainGoodsListViewData.getInstance().initData();
    }
  }
}
