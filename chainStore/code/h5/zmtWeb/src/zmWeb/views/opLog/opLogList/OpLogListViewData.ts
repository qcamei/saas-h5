import {OpLog} from "../../../bsModule/opLog/data/OpLog";
import {TimeSlot} from "../../zmComp/date/timeSlot/TimeSlot";
import {MgrPool} from "../../../comModule/MgrPool";

export class OpLogListViewData {

  oplogs: Array<OpLog> = new Array<OpLog>();
  curPage: number = 1;//页号
  minTime: number = 0;//开始时间
  maxTime: number = 0;//结束时间
  buserName: string = null;//操作人姓名
  type: number = -1;//日志来源类型，-1表示查询全部type
  loadingFinish: boolean = false;
  recordCount: number;//分页条数
  timeSlot: TimeSlot;//时间段
  itemActiveIndex: number = 0;//时间段默认选中的下标


  public static getInstance(): OpLogListViewData {
    return MgrPool.getInstance().get("OpLogListViewData", OpLogListViewData);
  }
}
