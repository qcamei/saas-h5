import {Injectable} from "@angular/core";
import {Subject, BehaviorSubject} from "rxjs";
import {MainViewData} from "./main.page";


@Injectable()
export class MainViewDataMgr {

  //观察者对象
  private mainVD: Subject<MainViewData> = new BehaviorSubject<MainViewData>(null);

  private dataChangedFunc;

  //MainViewData
  public setMainViewData(mainViewData:MainViewData):void{
    this.mainVD.next(mainViewData);
  }

  public subscribeMainVD(func:(mainViewData:MainViewData)=>void){
    this.mainVD.subscribe(func);
  }

  public notifyDataChanged():void{
    if(this.dataChangedFunc){
      this.dataChangedFunc();
    }
  }

  public subscribeMainDataChangedVD(func:()=>void){
    this.dataChangedFunc = func;
  }

}
