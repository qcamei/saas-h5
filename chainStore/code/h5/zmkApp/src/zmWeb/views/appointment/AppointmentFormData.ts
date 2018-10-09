import {AppointmentAddApiForm} from "../../bsModule/appointment/apiData/AppointmentAddApiForm";
import {SessionUtil} from "../../comModule/session/SessionUtil";
import {AppointProduct} from "../../bsModule/appointment/data/AppointProduct";
import {AppointmentViewData, ProductItemData} from "./AppointmentViewData";
import {AppUtils} from "../../comModule/AppUtils";

export class AppointmentFormData {

  private static instance:AppointmentFormData = new AppointmentFormData();

  public static getInstance():AppointmentFormData{
    return AppointmentFormData.instance;
  }

  private _appointmentViewData:AppointmentViewData;//预约页面数据

  public getAppointmentViewData(): AppointmentViewData {
    return this._appointmentViewData;
  }

  public setAppointmentViewData(value: AppointmentViewData) {
    this._appointmentViewData = value;
  }

  public clear(){
    this._appointmentViewData = null;
  }

  public toAddApiForm():AppointmentAddApiForm{
    let target = new AppointmentAddApiForm();
    target.storeId = SessionUtil.getInstance().getCurStoreId();
    target.cuserId = SessionUtil.getInstance().getLoginCUserId();
    target.appointTime = this.getFullAppointTimeNumber(this.getAppointmentViewData().curAppointDate, this.getAppointmentViewData().curAppointTime);
    target.appointProducts = this.toAppointProducts();
    return target;
  }

  private toAppointProducts(): Array<AppointProduct>{
    let appointProducts: Array<AppointProduct> = new Array<AppointProduct>();
    this.getAppointmentViewData().productList.forEach((item:ProductItemData)=> {
      if(item.selected){
        let target = AppointProduct.from(item);
        appointProducts.push(target);
      }
    });
    return appointProducts;
  }

  /**
   * 获取完整的预约时间
   * @param dateStr
   * @param timeStr
   * @returns {number}
   */
  public getFullAppointTimeNumber(dateStr:string, timeStr:string): number{
    // console.log("dateStr===================="+dateStr);
    // console.log("timeStr===================="+timeStr);
    let date = AppUtils.isoStrToDate(dateStr);
    let time = AppUtils.isoStrToDate(timeStr);
    // AppUtils.showInfo("日期", date.toLocaleString());
    // AppUtils.showInfo("时间", time.toLocaleString());
    let tmp = new Date();
    tmp.setFullYear(date.getFullYear(),date.getMonth(),date.getDate());
    tmp.setHours(time.getHours(),time.getMinutes(),time.getSeconds());
    // AppUtils.showInfo("预约时间", tmp.toLocaleString());
    return tmp.getTime();
  }



}
