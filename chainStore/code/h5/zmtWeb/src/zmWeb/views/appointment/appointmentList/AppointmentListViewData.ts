import {AppointmentQueryForm} from "../../../bsModule/appointment/apiData/AppointmentQueryForm";
import {ZmMap, AppUtils} from "../../../comModule/AppUtils";
import {Leaguer} from "../../../bsModule/storeLeaguerInfo/data/Leaguer";
import {TimeSlot} from "../../zmComp/date/timeSlot/TimeSlot";
import {MgrPool} from "../../../comModule/MgrPool";

export class AppointmentListViewData{

  leaguerMap: ZmMap<Leaguer>;
  reasonsList:Array<string> = new Array<string>();

  appointmentList: Array<AppointmentData> = new Array<AppointmentData>();
  recordCount: number;//分页条数
  loadingFinish: boolean = false;

  curPage:number = 1;
  timeSlot: TimeSlot;//时间段
  itemActiveIndex: number = 2;//默认选中的下标

  queryForm: AppointmentQueryForm = new AppointmentQueryForm();

}



export class AppointmentData {
  id: string;
  leaguerId: string;
  leaguerName: string;
  appointTime: number;
  status: number;//AppointmentStatusEnum
  origin: number;//OriginTypeEnum
  creatorId: string;
}
