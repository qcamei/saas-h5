import {MainViewData} from "./MainViewData";
import {ViewDataMgr} from "../zmComUtils/ViewDataMgr";


export class MainViewDataMgr {


  private static Instance: MainViewDataMgr = new MainViewDataMgr();

  public static getInstance(): MainViewDataMgr{
    return MainViewDataMgr.Instance;
  }

  private viewDataMgr:ViewDataMgr<MainViewData> = new ViewDataMgr<MainViewData>();

  public setData(vieData: MainViewData): void {
    this.viewDataMgr.setData(vieData);
  }

  public onDataChanged(initData:MainViewData, func: (viewData: MainViewData) => void) {
    this.viewDataMgr.onDataChanged(initData,func);
  }

  public onInformDataChanged(func: () => void) {
    this.viewDataMgr.onInformDataChanged(func);
  }
  onViewDestroy():void{
    this.viewDataMgr.onViewDestroy();
  }

  public notifyDataChanged(): void {
    this.viewDataMgr.notifyDataChanged();
  }


  //
  // //观察者对象
  // private mainVD: Subject<MainViewData> = new BehaviorSubject<MainViewData>(null);
  //
  // private dataChangedFunc;
  //
  // //MainViewData
  // public setMainViewData(mainViewData:MainViewData):void{
  //   this.mainVD.next(mainViewData);
  // }
  //
  // public subscribeMainVD(func:(mainViewData:MainViewData)=>void){
  //   this.mainVD.subscribe(func);
  // }
  //
  // public notifyDataChanged():void{
  //   if(this.dataChangedFunc){
  //     this.dataChangedFunc();
  //   }
  // }
  //
  // public subscribeMainDataChangedVD(func:()=>void){
  //   this.dataChangedFunc = func;
  // }

}
