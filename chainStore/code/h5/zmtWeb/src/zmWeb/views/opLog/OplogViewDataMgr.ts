import {BehaviorSubject, Subject} from "rxjs/index";
import {Injectable} from "@angular/core";
import {OpLogListViewData} from "./opLogList/OpLogListViewData";

@Injectable()
export class OplogViewDataMgr {

  private opLogListVD: Subject<OpLogListViewData> = new BehaviorSubject<OpLogListViewData>(null);

  public setOpLogListViewData(opLogListViewData:OpLogListViewData):void{
    this.opLogListVD.next(opLogListViewData);
  }

  public subscribeLogListVD(func: (opLogListViewData: OpLogListViewData) => void): any {
    this.opLogListVD.subscribe(func);
  }
}
