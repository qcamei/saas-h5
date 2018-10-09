import {ViewDataMgr} from "../../zmComUtils/ViewDataMgr";
import {MyProductCardViewData} from "./myProductCard.page";

export class MyProductCardViewDataMgr{

  private static Instance: MyProductCardViewDataMgr = new MyProductCardViewDataMgr();

  public static getInstance(): MyProductCardViewDataMgr{

    return MyProductCardViewDataMgr.Instance;
  }

  private viewDataMgr:ViewDataMgr<MyProductCardViewData> = new ViewDataMgr<MyProductCardViewData>();

  public setData(viewData:MyProductCardViewData):void{

    this.viewDataMgr.setData(viewData);
  }

  public onDataChanged(initData:MyProductCardViewData,func:(viewData:MyProductCardViewData) => void){

    this.viewDataMgr.onDataChanged(initData,func);

  }

}
