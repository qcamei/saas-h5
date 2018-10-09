import {Injectable} from "@angular/core";
import {Subject, BehaviorSubject} from "rxjs";
import {ExpiredViewData} from "./expired/expired";


@Injectable()
export class ErrorViewDataMgr {

  //观察者对象
  private expiredVD: Subject<ExpiredViewData> = new BehaviorSubject<ExpiredViewData>(null);
  private dataChangeFunc;

  //expired
  public setExpiredViewData(expiredViewData:ExpiredViewData):void{
    this.expiredVD.next(expiredViewData);
  }

  public subscribeExpiredVD(func:(findStoreViewData:ExpiredViewData)=>void){
    this.expiredVD.subscribe(func);
  }

  public subscribeExpiredDataChanged(func:()=>void){
    this.dataChangeFunc = func;
  }

  public notifyDataChanged():void{
    if(this.dataChangeFunc){
      this.dataChangeFunc();
    }
  }

}
