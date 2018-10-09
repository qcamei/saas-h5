import {Injectable} from "@angular/core";
import {Subject, BehaviorSubject} from "rxjs";
import { BUserListViewData} from "./page/buserList";

@Injectable()
export class BUserViewDataMgr {

  //观察者对象
  private homeVD: Subject<BUserListViewData> = new BehaviorSubject<BUserListViewData>(null);
  private dataChangedFunc;

  public setBUserListViewData(buserListViewData: BUserListViewData): void {
    this.homeVD.next(buserListViewData);
  }

  public subscribeBUserListViewDataVD(func: (buserListViewData: BUserListViewData) => void) {
    this.homeVD.subscribe(func);
  }


  public notifyDataChanged(): void {
    if(this.dataChangedFunc){
      this.dataChangedFunc();
    }
  }

  public subscribeBUserDataChangedVD(func: () => void) {
    this.dataChangedFunc = func;
  }


}
