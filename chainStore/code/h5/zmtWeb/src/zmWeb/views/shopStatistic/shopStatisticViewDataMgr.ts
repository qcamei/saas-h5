import {Injectable} from "@angular/core";
import {Subject, BehaviorSubject, Subscription} from "rxjs";
import {AriaChartsViewDara} from "../../bsModule/ariaCharts/data/AriaChartsViewDara";

@Injectable()
export class shopStatisticViewDataMgr { //场景：列表->编辑->列表

  private addMemberCardVDS: Subject<AriaChartsViewDara> = new BehaviorSubject<AriaChartsViewDara>(null);//观察者对象

  public setAddMemberCardViewData(addMemberCardViewData: AriaChartsViewDara): void {
    this.addMemberCardVDS.next(addMemberCardViewData);
  }

  public subscribeAddMemberCardVD(func: (viewData: AriaChartsViewDara) => void) {
    this.addMemberCardVDS.subscribe(func);
  }

}
