import {Injectable} from "@angular/core";
import {Subject, BehaviorSubject} from "rxjs";
import {BUserListViewData} from "./buserList/buserList";
import {BUserEditViewData} from "./buserEdit/buserEdit";


@Injectable()
export class BUserViewDataMgr { //场景：列表->编辑->列表


  private buserListVDS: Subject<BUserListViewData> = new BehaviorSubject<BUserListViewData>(null);//观察者对象

  public setBUserListViewData(viewData: BUserListViewData): void {
    this.buserListVDS.next(viewData);
  }

  public subscribeBUserListVD(func: (viewData: BUserListViewData) => void) {
    this.buserListVDS.subscribe(func);
  }

  private buserEditVDS: Subject<BUserEditViewData> = new BehaviorSubject<BUserEditViewData>(null);//观察者对象

  public setBUserEditViewData(viewData: BUserEditViewData): void {
    this.buserEditVDS.next(viewData);
  }

  public subscribeBUserEditVD(func: (viewData: BUserEditViewData) => void) {
    this.buserEditVDS.subscribe(func);
  }

}
