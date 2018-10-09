import {Subject, BehaviorSubject, Subscription} from "rxjs";

export class ViewDataMgr<T> {


  private dataSubject: Subject<T>;
  private viewDataSub:Subscription;
  private dataChangedFunc;

  public setData(vieData: T): void {
    this.dataSubject.next(vieData);
  }

  public onDataChanged(initData:T, func: (viewData: T) => void) {
    this.dataSubject = new BehaviorSubject<T>(initData);
    this.viewDataSub = this.dataSubject.subscribe(func);
  }

  public onInformDataChanged(func: () => void) {
    this.dataChangedFunc = func;
  }
  //不用注销(页面的ondestroy是异步的，同个页面同时注销和加载会有问题)，最多每个页面保留一个。
  onViewDestroy():void{
    // if(!AppUtils.isNullObj(this.viewDataSub)){
    //   this.viewDataSub.unsubscribe();
    // }
  }

  public notifyDataChanged(): void {
    if(this.dataChangedFunc){
      this.dataChangedFunc();
    }
  }
}
