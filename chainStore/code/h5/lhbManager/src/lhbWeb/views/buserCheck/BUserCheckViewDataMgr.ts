import {Injectable} from "@angular/core";
import {Subject, BehaviorSubject} from "rxjs";
import {BUserCheckListViewData} from "./page/buserCheckList";

@Injectable()
export class BUserCheckViewDataMgr {

  //观察者对象
  private homeVD: Subject<BUserCheckListViewData> = new BehaviorSubject<BUserCheckListViewData>(null);
  private dataChangedFunc;

  public setBUserCheckViewData(checkViewData: BUserCheckListViewData): void {
    this.homeVD.next(checkViewData);
  }

  public subscribeBUserCheckViewDataVD(func: (checkViewData: BUserCheckListViewData) => void) {
    this.homeVD.subscribe(func);
  }


  public notifyDataChanged(): void {
    if(this.dataChangedFunc){
      this.dataChangedFunc();
    }
  }

  public subscribeBUserCheckDataChangedVD(func: () => void) {
    this.dataChangedFunc = func;
  }


}
