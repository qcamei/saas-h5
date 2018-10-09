import {Subject} from "rxjs/Subject";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {StoreStatisticsViewData} from "./store-statistics.viewData";
import {Injectable} from "@angular/core";

@Injectable()
export class StoreStatisticsViewDataMgr {

  private storeStatisticsViewData: Subject<StoreStatisticsViewData> = new BehaviorSubject<StoreStatisticsViewData>(null);

  public setStoreStatisticsViewData(viewData: StoreStatisticsViewData): void {
    this.storeStatisticsViewData.next(viewData);
  }

  public subscribeStoreStatisticsViewData(func: (viewData: StoreStatisticsViewData) => void): any {
    this.storeStatisticsViewData.subscribe(func);
  }
}
