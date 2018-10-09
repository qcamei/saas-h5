import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {Appointment} from "./data/Appointment";
import {AppUtils, ReqMap} from "../../comModule/AppUtils";
import {AppointmentUpdateApiForm} from "./apiData/AppointmentUpdateApiForm";
import {AppointmentAddApiForm} from "./apiData/AppointmentAddApiForm";
import {AppCfg} from "../../comModule/AppCfg";
import {AppointmentUpdateType} from "./apiData/AppointmentUpdateType";
import {AppointmentUpdateStatusApiForm} from "./apiData/AppointmentUpdateStatusApiForm";
import {SessionUtil} from "../../comModule/session/SessionUtil";
import {MgrPool} from "../../comModule/MgrPool";
import {AppointmentQueryForm} from "./apiData/AppointmentQueryForm";
import {PageResp} from "../../comModule/asynDao/apiData/PageResp";
import {RestResp} from "../../comModule/asynDao/apiData/RestResp";

export class AppointmentMgr {

  public static getInstance():AppointmentMgr{
    return MgrPool.getInstance().get("AppointmentMgr",AppointmentMgr);
  }

  private appointmentDao: AppointmentDao;

  constructor() {
    this.appointmentDao = new AppointmentDao();
  }

  public addAppointment(addForm:AppointmentAddApiForm):Promise<RestResp>{
    return this.appointmentDao.rawReq("",addForm);
  }

  public getAppointment(storeId:string, appointmentId:string):Promise<Appointment>{
    let uriPattern = "{0}/{1}/";
    let uri = AppUtils.format(uriPattern,storeId,appointmentId);
    return this.appointmentDao.getByUri(uri);
  }

  public updateAppointment(appointmentId:string,updateForm:AppointmentUpdateApiForm):Promise<boolean>{
    return this.appointmentDao.updateWithId(appointmentId,updateForm);
  }

  public updateAppointmentState(appointmentId:string,updateStatusForm:AppointmentUpdateStatusApiForm):Promise<boolean>{
    let updateForm:AppointmentUpdateApiForm = new AppointmentUpdateApiForm();
    updateForm.storeId = SessionUtil.getInstance().getCurStoreId();
    updateForm.updateType = AppointmentUpdateType.UpdateState;
    updateStatusForm.operatorId = SessionUtil.getInstance().getLoginCUserId();
    updateStatusForm.operatorName = SessionUtil.getInstance().getLoginCUser().name;
    updateForm.updateStatusData = updateStatusForm;
    return this.updateAppointment(appointmentId,updateForm);
  }

  public findAppointmentList(queryForm:AppointmentQueryForm):Promise<PageResp<Appointment>>{
    let findPath = "findPage";
    let reqMap = new ReqMap();
    reqMap.add("storeId", queryForm.storeId)
      .add("cuserId", queryForm.cuserId)
      .add("status", queryForm.status);
      // .add("minTime", queryForm.minTime)
      // .add("maxTime", queryForm.maxTime)
      // .add("pageItemCount", "0")
      // .add("pageNo", queryForm.pageNo.toString());
    return this.appointmentDao.getPageRespByType(findPath, reqMap, Appointment);
  }

}

export class AppointmentDao extends AsyncRestDao<Appointment> {
  constructor() {
    let table = "appointment";
    super(Appointment, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
