import {MyViewData} from "./MyViewData";
import {ViewDataMgr} from "../../zmComUtils/ViewDataMgr";

export class MyViewDataMgr{

  private static Instance: MyViewDataMgr = new MyViewDataMgr();

  public static getInstance(): MyViewDataMgr{

    return MyViewDataMgr.Instance;
  }

  private viewDataMgr:ViewDataMgr<MyViewData> = new ViewDataMgr<MyViewData>();

  public setData(viewData:MyViewData):void{

    this.viewDataMgr.setData(viewData);
  }

  public onDataChanged(initData:MyViewData,func:(viewData:MyViewData) => void){

    this.viewDataMgr.onDataChanged(initData,func);

  }

}
