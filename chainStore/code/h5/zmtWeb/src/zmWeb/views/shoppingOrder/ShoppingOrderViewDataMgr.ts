import {BehaviorSubject, Subject} from "rxjs/index";
import {Injectable} from "@angular/core";
import {ShoppingOrderListViewData} from "./shoppingOrderList/shoppingListViewData";
import {ShoppingDetailViewData} from "./shoppingDetails/shoppingDetailViewData";

@Injectable()
export class ShoppingOrderViewDataMgr {

  private shoppingOrderListVD: Subject<ShoppingOrderListViewData> = new BehaviorSubject<ShoppingOrderListViewData>(null);

  public setShoppingOrderListViewData(shoppingOrderListViewData:ShoppingOrderListViewData):void{
    this.shoppingOrderListVD.next(shoppingOrderListViewData);
  }

  public subscribeShoppingOrderListVD(func: (shoppingOrderListViewData: ShoppingOrderListViewData) => void): any {
    this.shoppingOrderListVD.subscribe(func);
  }
}
