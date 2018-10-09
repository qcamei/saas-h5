import {ViewDataMgr} from "../../zmComUtils/ViewDataMgr";
import {MyPreCardViewData} from "./myPreCard.page";

export class MyPreCardViewDataMgr{

  private static Instance: MyPreCardViewDataMgr = new MyPreCardViewDataMgr();

  public static getInstance(): MyPreCardViewDataMgr{

    return MyPreCardViewDataMgr.Instance;
  }

  private viewDataMgr:ViewDataMgr<MyPreCardViewData> = new ViewDataMgr<MyPreCardViewData>();

  public setData(viewData:MyPreCardViewData):void{

    this.viewDataMgr.setData(viewData);
  }

  public onDataChanged(initData:MyPreCardViewData,func:(viewData:MyPreCardViewData) => void){

    this.viewDataMgr.onDataChanged(initData,func);

  }

}
