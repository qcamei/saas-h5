import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {Appointment} from "./data/Appointment";
import {ReqMap} from "../../comModule/AppUtils";
import {AppointmentUpdateApiForm} from "./apiData/AppointmentUpdateApiForm";
import {AppointmentAddApiForm} from "./apiData/AppointmentAddApiForm";
import {AppCfg} from "../../comModule/AppCfg";
import {PageResp} from "../../comModule/PageResp";
import {AppointmentQueryForm} from "./apiData/AppointmentQueryForm";
import {AppointmentDeleteForm} from "./apiData/AppointmentDeleteForm";
import {AppointmentUpdateType} from "./apiData/AppointmentUpdateType";
import {AppointmentUpdateStatusApiForm} from "./apiData/AppointmentUpdateStatusApiForm";
import {SessionUtil} from "../../comModule/session/SessionUtil";


@Injectable()
export class AppointmentMgr {
  private appointmentDao: AppointmentDao;

  constructor(private restProxy: AsyncRestProxy) {
    this.appointmentDao = new AppointmentDao(restProxy);
  }

  public findAppointmentListByStoreId(storeId:string):Promise<Array<Appointment>>{
    let findPath = "findAppointmentList";
    let pageItemCount = 200;
    let pageNo = 1;
    let reqMap = new ReqMap();
    reqMap.add("storeId", storeId);
    return this.appointmentDao.findListWithReqParam(findPath, reqMap, pageItemCount, pageNo);
  }


  public findAppointmentListByTime(storeId:string,minTime:string,maxTime:string):Promise<Array<Appointment>>{
    let findPath = "findAppointmentList";
    let pageItemCount = 100;
    let pageNo = 1;
    let reqMap = new ReqMap();
    reqMap.add("storeId", storeId)
      .add("minTime", minTime)
      .add("maxTime", maxTime);
    return this.appointmentDao.findListWithReqParam(findPath, reqMap, pageItemCount, pageNo);
  }

  //minTime maxTime buserId storeId pageItemCount  pageNo origin status sort leaguerId leaguerName
  public getAppointmentPageInfo(queryForm:AppointmentQueryForm):Promise<PageResp>{
    let findPath = "getAppointmentPageInfo";
    let pageItemCount = 10;
    let reqMap = new ReqMap();
    reqMap.add("storeId", queryForm.storeId)
      .add("leaguerName", queryForm.leaguerName)
      .add("status", queryForm.status)
      .add("origin", queryForm.origin.toString())
      .add("minTime", queryForm.minTime)
      .add("maxTime", queryForm.maxTime)
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
    return this.appointmentDao.addForm(addForm);
  }

}

export class AppointmentDao extends AsyncRestDao<Appointment> {
  constructor(restProxy: AsyncRestProxy) {
    var table = "appointment";
    super(Appointment, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
