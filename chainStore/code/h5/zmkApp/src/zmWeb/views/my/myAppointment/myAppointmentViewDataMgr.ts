import {ViewDataMgr} from "../../zmComUtils/ViewDataMgr";
import {MyAppointmentViewData} from "./myAppointment.page";

export class MyAppointmentViewDataMgr{

  private static Instance: MyAppointmentViewDataMgr = new MyAppointmentViewDataMgr();

  public static getInstance(): MyAppointmentViewDataMgr{
    return MyAppointmentViewDataMgr.Instance;
  }

  private viewDataMgr:ViewDataMgr<MyAppointmentViewData> = new ViewDataMgr<MyAppointmentViewData>();

  public setData(viewData:MyAppointmentViewData):void{
    this.viewDataMgr.setData(viewData);
  }

  public onDataChanged(initData:MyAppointmentViewData, func:(viewData:MyAppointmentViewData) => void){
    this.viewDataMgr.onDataChanged(initData,func);
  }

}
