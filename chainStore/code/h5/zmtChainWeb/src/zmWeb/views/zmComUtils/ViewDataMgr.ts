import {Subject, BehaviorSubject, Subscription} from "rxjs";
import {AppUtils} from "../../comModule/AppUtils";

export class ViewDataMgr<T> {


  private dataSubject: Subject<T> = new Subject();
  private viewDataSub:Subscription;
  private dataChangedFunc;

  public setData(vieData: T): void {
    if(!AppUtils.isNullObj(this.dataSubject)){
      this.dataSubject.next(vieData);
    }
  }

  public onDataChanged(initData:T, func: (viewData: T) => void) {
    this.dataSubject = new BehaviorSubject<T>(initData);
    this.viewDataSub = this.dataSubject.subscribe(func);
  }

  public onInformDataChanged(func: () => void) {
    this.dataChangedFunc = func;
  }
  onViewDestroy():void{
    if(!AppUtils.isNullObj(this.viewDataSub)){
      this.viewDataSub.unsubscribe();
    }
    this.dataSubject = null;
    this.dataChangedFunc = null;
  }

  public notifyDataChanged(): void {
    if(this.dataChangedFunc){
      this.dataChangedFunc();
    }
  }
}
