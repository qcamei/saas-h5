import {ViewDataMgr} from "../../zmComUtils/ViewDataMgr";
import {MyMemCardViewData} from "./myMemCardViewData";

export class MyMemCardViewDataMgr{

  private static Instance: MyMemCardViewDataMgr = new MyMemCardViewDataMgr();

  public static getInstance(): MyMemCardViewDataMgr{

    return MyMemCardViewDataMgr.Instance;
  }

  private viewDataMgr:ViewDataMgr<MyMemCardViewData> = new ViewDataMgr<MyMemCardViewData>();

  public setData(viewData:MyMemCardViewData):void{

    this.viewDataMgr.setData(viewData);
  }

  public onDataChanged(initData:MyMemCardViewData,func:(viewData:MyMemCardViewData) => void){
    this.viewDataMgr.onDataChanged(initData,func);

  }

}
