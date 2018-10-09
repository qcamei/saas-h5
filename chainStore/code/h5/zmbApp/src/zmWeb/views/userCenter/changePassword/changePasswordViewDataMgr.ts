import {ViewDataMgr} from "../../zmComUtils/ViewDataMgr";
import {ChangePasswordViewData} from "./changePassword.page";

export class ChangePasswordViewDataMgr{

  private static Instance: ChangePasswordViewDataMgr = new ChangePasswordViewDataMgr();

  public static getInstance(): ChangePasswordViewDataMgr{

    return ChangePasswordViewDataMgr.Instance;
  }

  private viewDataMgr:ViewDataMgr<ChangePasswordViewData> = new ViewDataMgr<ChangePasswordViewData>();

  public setData(viewData:ChangePasswordViewData):void{

    this.viewDataMgr.setData(viewData);
  }

  public onDataChanged(initData:ChangePasswordViewData,func:(viewData:ChangePasswordViewData) => void){

    this.viewDataMgr.onDataChanged(initData,func);

  }

}
