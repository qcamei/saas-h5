import {UserDetailViewData} from "./userDetailViewData";
import {ViewDataMgr} from "../../zmComUtils/ViewDataMgr";

export class UserDetailViewDataMgr{

  private static Instance: UserDetailViewDataMgr = new UserDetailViewDataMgr();

  public static getInstance(): UserDetailViewDataMgr{

    return UserDetailViewDataMgr.Instance;
  }

  private viewDataMgr:ViewDataMgr<UserDetailViewData> = new ViewDataMgr<UserDetailViewData>();

  public setData(viewData:UserDetailViewData):void{

    this.viewDataMgr.setData(viewData);
  }

  public onDataChanged(initData:UserDetailViewData,func:(viewData:UserDetailViewData) => void){

    this.viewDataMgr.onDataChanged(initData,func);

  }

}
