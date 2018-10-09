import {Injectable} from "@angular/core";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {Appointment} from "./data/Appointment";
import {ReqMap} from "../../comModule/AppUtils";
import {AppointmentUpdateApiForm} from "./apiData/AppointmentUpdateApiForm";
import {AppointmentAddApiForm} from "./apiData/AppointmentAddApiForm";
import {AppCfg} from "../../comModule/AppCfg";
import {AppointmentQueryForm} from "./apiData/AppointmentQueryForm";
import {AppointmentDeleteForm} from "./apiData/AppointmentDeleteForm";
import {AppointmentUpdateType} from "./apiData/AppointmentUpdateType";
import {AppointmentUpdateStatusApiForm} from "./apiData/AppointmentUpdateStatusApiForm";
import {SessionUtil} from "../../comModule/session/SessionUtil";
import {PageResp} from "../../comModule/asynDao/apiData/PageResp";
import {MgrPool} from "../../comModule/MgrPool";


// @Injectable()
export class AppointmentMgr {
  private appointmentDao: AppointmentDao;

  public static getInstance():AppointmentMgr{
    return MgrPool.getInstance().get("AppointmentMgr",AppointmentMgr);
  }

  constructor() {
    this.appointmentDao = new AppointmentDao();
  }

  public findAppointmentListByStoreId(storeId:string):Promise<Array<Appointment>>{
    let findPath = "findAppointmentList";
    let pageItemCount = 200;
    let pageNo = 1;
    let reqMap = new ReqMap();
    reqMap.add("storeId", storeId);
    return this.appointmentDao.findListWithReqParamAndPageParam(findPath, reqMap, pageItemCount, pageNo);
  }


  public findAppointmentListByTime(storeId:string,minTime:string,maxTime:string):Promise<Array<Appointment>>{
    let findPath = "findAppointmentList";
    let pageItemCount = 100;
    let pageNo = 1;
    let reqMap = new ReqMap();
    reqMap.add("storeId", storeId)
      .add("minTime", minTime)
      .add("maxTime", maxTime);
    return this.appointmentDao.findListWithReqParamAndPageParam(findPath, reqMap, pageItemCount, pageNo);
  }

  //minTime maxTime buserId storeId pageItemCount  pageNo origin status sort leaguerId leaguerName
  public getAppointmentPageInfo(queryForm:AppointmentQueryForm):Promise<PageResp>{
    let findPath = "getAppointmentPageInfo";
    let pageItemCount = 10;
    let reqMap = new ReqMap();
    reqMap.add("storeId", queryForm.storeId)
      .add("buserId",queryForm.buserId)
      .add("leaguerName", queryForm.leaguerName)
      .add("status", queryForm.status)
      .add("origin", queryForm.origin.toString())
      .add("minTime", queryForm.minTime.toString())
      .add("maxTime", queryForm.maxTime.toString())
      .add("pageItemCount", pageItemCount.toString())
      .add("pageNo", queryForm.pageNo.toString());
    return this.appointmentDao.getPageRespByType(findPath, reqMap,Appointment);
  }

  public getAppointment(apptId:string):Promise<Appointment>{
    return this.appointmentDao.get(apptId);
  }

  //软删除
  public deleteAppointment(storeId:string,appointmentDeleteForm:AppointmentDeleteForm){
    let updateForm:AppointmentUpdateApiForm = new AppointmentUpdateApiForm();
    updateForm.storeId = storeId;
    updateForm.updateType = AppointmentUpdateType.DeleteAppoint;
    updateForm.appointmentDeleteForm = appointmentDeleteForm;
    debugger
    return this.updateAppointment(appointmentDeleteForm.appointmentId,updateForm);
  }

  //直接删除
  // public deleteAppointment(apptId:string){
  //   return this.appointmentDao.delete(apptId);
  // }

  public updateAppointmentState(appointmentId:string,updateStatusForm:AppointmentUpdateStatusApiForm){
    let updateForm:AppointmentUpdateApiForm = new AppointmentUpdateApiForm();
    updateForm.storeId = SessionUtil.getInstance().getStoreId();
    updateForm.updateType = AppointmentUpdateType.UpdateState;
    updateStatusForm.operatorId = SessionUtil.getInstance().getUserId();
    updateStatusForm.operatorName = SessionUtil.getInstance().getUserName();
    updateForm.updateStatusData = updateStatusForm;
    return this.updateAppointment(appointmentId,updateForm);
  }


  public updateAppointment(apptId:string,updateForm:AppointmentUpdateApiForm):Promise<boolean>{
    return this.appointmentDao.updateWithId(apptId,updateForm);
  }

  public addAppointment(addForm:AppointmentAddApiForm):Promise<Appointment>{
    return this.appointmentDao.add(addForm);
  }

}

export class AppointmentDao extends AsyncRestDao<Appointment> {
  constructor() {
    var table = "appointment";
    super(Appointment, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
