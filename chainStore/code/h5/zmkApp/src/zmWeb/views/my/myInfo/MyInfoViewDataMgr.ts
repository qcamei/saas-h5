import {MyInfoViewData} from "./MyInfoViewData";
import {ViewDataMgr} from "../../zmComUtils/ViewDataMgr";
/**
 * Created by Orange on 2018/6/24.
 */
export class MyInfoViewDataMgr{

  private static Instance: MyInfoViewDataMgr = new MyInfoViewDataMgr();

  public static getInstance(): MyInfoViewDataMgr{

    return MyInfoViewDataMgr.Instance;
  }

  private viewDataMgr:ViewDataMgr<MyInfoViewData> = new ViewDataMgr<MyInfoViewData>();

  public setData(viewData:MyInfoViewData):void{

    this.viewDataMgr.setData(viewData);
  }

  public onDataChanged(initData:MyInfoViewData,func:(viewData:MyInfoViewData) => void){

    this.viewDataMgr.onDataChanged(initData,func);

  }

}
