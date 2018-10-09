import {MgrPool} from "../../../comModule/MgrPool";
import {TimeSlot} from "../../zmComp/form/date/timeSlot/TimeSlot";
import {WorkFlowData} from "../../../bsModule/workFlow/data/WorkFlowData";
import {Constants} from "../../zmComUtils/Constants";

export class WFListVD {
  private _wfList: Array<WorkFlowData> = new Array<WorkFlowData>();
  private _curPage: number = 1;//页号
  private _status: string = null;
  private _loadingFinish: boolean = false;
  private _totalCount: number;//总记录数
  private _timeSlot: TimeSlot;//时间段
  private _pageItemCount: number = Constants.PAGE_ITEM_COUNT;//每页条数


  get wfList(): Array<WorkFlowData> {
    return this._wfList;
  }

  set wfList(value: Array<WorkFlowData>) {
    this._wfList = value;
  }

  get curPage(): number {
    return this._curPage;
  }

  set curPage(value: number) {
    this._curPage = value;
  }

  get status(): string {
    return this._status;
  }

  set status(value: string) {
    this._status = value;
  }

  get loadingFinish(): boolean {
    return this._loadingFinish;
  }

  set loadingFinish(value: boolean) {
    this._loadingFinish = value;
  }

  get totalCount(): number {
    return this._totalCount;
  }

  set totalCount(value: number) {
    this._totalCount = value;
  }

  get timeSlot(): TimeSlot {
    return this._timeSlot;
  }

  set timeSlot(value: TimeSlot) {
    this._timeSlot = value;
  }


  get pageItemCount(): number {
    return this._pageItemCount;
  }

  set pageItemCount(value: number) {
    this._pageItemCount = value;
  }
}
