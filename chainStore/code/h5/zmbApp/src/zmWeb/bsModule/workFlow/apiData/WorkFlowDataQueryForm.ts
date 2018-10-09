export class WorkFlowDataQueryForm {
  // 店铺ID
  private _storeId: string;
  // 状态，如果需要查询多个，请用,号分割
  private _status: string;
  // 开始时间
  private _minTime: number;
  // 结束时间
  private _maxTime: number;
  // 工作流类型
  private _workFlowTypeId: string;
  // 客户名称 或 手机号码 编号
  private _leaguerNameOrPhone: string;
  // 跟进人员
  private _buserId: number;

  private _pageItemCount: number;
  private _pageNo: number;


  get storeId(): string {
    return this._storeId;
  }

  set storeId(value: string) {
    this._storeId = value;
  }

  get status(): string {
    return this._status;
  }

  set status(value: string) {
    this._status = value;
  }

  get minTime(): number {
    return this._minTime;
  }

  set minTime(value: number) {
    this._minTime = value;
  }

  get maxTime(): number {
    return this._maxTime;
  }

  set maxTime(value: number) {
    this._maxTime = value;
  }

  get workFlowTypeId(): string {
    return this._workFlowTypeId;
  }

  set workFlowTypeId(value: string) {
    this._workFlowTypeId = value;
  }

  get leaguerNameOrPhone(): string {
    return this._leaguerNameOrPhone;
  }

  set leaguerNameOrPhone(value: string) {
    this._leaguerNameOrPhone = value;
  }

  get buserId(): number {
    return this._buserId;
  }

  set buserId(value: number) {
    this._buserId = value;
  }

  get pageItemCount(): number {
    return this._pageItemCount;
  }

  set pageItemCount(value: number) {
    this._pageItemCount = value;
  }

  get pageNo(): number {
    return this._pageNo;
  }

  set pageNo(value: number) {
    this._pageNo = value;
  }
}
