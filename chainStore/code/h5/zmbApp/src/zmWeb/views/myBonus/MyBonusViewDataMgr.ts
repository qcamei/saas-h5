import {MyBonusViewData} from "./MyBonus.page";
import {ViewDataMgr} from "../zmComUtils/ViewDataMgr";

export class MyBonusViewDataMgr{

  private static instance:MyBonusViewDataMgr = new MyBonusViewDataMgr();
  private viewDataMgr:ViewDataMgr<MyBonusViewData> = new ViewDataMgr<MyBonusViewData>();

  public static getInstance():MyBonusViewDataMgr{
    return MyBonusViewDataMgr.instance;
  }

  public setData(viewData:MyBonusViewData){
    this.viewDataMgr.setData(viewData);
  }

  public onDataChange(initViewData:MyBonusViewData,fun:(viewData:MyBonusViewData)=>void){
    this.viewDataMgr.onDataChanged(initViewData,fun);
  }

}
