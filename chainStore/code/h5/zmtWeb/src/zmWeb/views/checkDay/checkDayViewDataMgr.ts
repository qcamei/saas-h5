
import {Injectable} from "@angular/core";
import {CheckDayListViewData} from "./checkDayList/checkDayList";
import {Subject} from "rxjs/Subject";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {CheckDayHandDetailViewData} from "./checkDayHandDetail/checkDayHandDetail";
import {CheckDayHandViewData} from "./checkDayHand/checkDayHand";


@Injectable()
export class CheckDayViewDataMgr {

  //日结列表
  private checkDayListVD: Subject<CheckDayListViewData> = new BehaviorSubject<CheckDayListViewData>(null);

  public setCheckDayListViewData(checkDayListViewData:CheckDayListViewData):void{
    this.checkDayListVD.next(checkDayListViewData);
  }

  public subscribeCheckDayListVD(func: (checkDayListViewData: CheckDayListViewData) => void) {
    this.checkDayListVD.subscribe(func);
  }

  //日结详情
  private checkDayDetailVD: Subject<CheckDayHandDetailViewData> = new BehaviorSubject<CheckDayHandDetailViewData>(null);

  public setCheckDayDetailViewData(checkDayDetailViewData:CheckDayHandDetailViewData):void{
    this.checkDayDetailVD.next(checkDayDetailViewData);
  }

  public subscribeCheckDayDetailVD(func: (checkDayDetailViewData: CheckDayHandDetailViewData) => void) {
    this.checkDayDetailVD.subscribe(func);
  }

  //预生成日结
  private preCheckDayVD: Subject<CheckDayHandViewData> = new BehaviorSubject<CheckDayHandViewData>(null);

  public setPreCheckDayViewData(checkDayHandViewData:CheckDayHandViewData):void{
    this.preCheckDayVD.next(checkDayHandViewData);
  }

  public subscribePreCheckDayVD(func: (checkDayHandViewData: CheckDayHandViewData) => void) {
    this.preCheckDayVD.subscribe(func);
  }

}
