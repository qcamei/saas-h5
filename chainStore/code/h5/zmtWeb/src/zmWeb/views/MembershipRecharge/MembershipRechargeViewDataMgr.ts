import {Injectable} from "@angular/core";
import {Subject, BehaviorSubject, Subscription} from "rxjs";
import {RechargeListViewData} from "./rechargeList/rechargeList";


@Injectable()
export class MembershipRechargeViewDataMgr { //场景：列表->编辑->列表


  private rechargeListViewDataVDS: Subject<RechargeListViewData> = new BehaviorSubject<RechargeListViewData>(null);//观察者对象

  public setRechargeListViewData(rechargeListViewData: RechargeListViewData): void {
    this.rechargeListViewDataVDS.next(rechargeListViewData);
  }

  public subscribeRechargeListViewDataVD(func: (viewData: RechargeListViewData) => void): Subscription { //接受者
    return this.rechargeListViewDataVDS.subscribe(func);
  }

}
