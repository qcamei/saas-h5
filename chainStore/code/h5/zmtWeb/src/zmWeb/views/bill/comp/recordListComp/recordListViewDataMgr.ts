import {Subject, BehaviorSubject} from "rxjs";
import {Injectable} from "@angular/core";
import {RecordListViewData} from "./recordListComp";
@Injectable()
export class RecordListViewDataMgr {

  private recordListVD: Subject<RecordListViewData> = new BehaviorSubject<RecordListViewData>(null);

  //recordList
  public setListViewData(viewData:RecordListViewData):void{
    this.recordListVD.next(viewData);
  }

  public subscribeListVD(func:(viewData:RecordListViewData)=>void){
    this.recordListVD.subscribe(func);
  }

}
