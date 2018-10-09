export class LeaguerInfo {
  // 客户ID
  private _leaguerId: string;
  // 客户名称
  private _leaguerName: string;
  // 客户 服务前拍照
  private _picBefore: string;
  // 客户 服务后拍照
  private _picAfter: string;
  // 客户档案ID 备注信息
  private _cuserDocId: number;
  // 客户关怀跟进ID 闹钟信息
  private _cuserCareId: number;
  // 跟进人员
  private _followUserId: number;


  get leaguerId(): string {
    return this._leaguerId;
  }

  set leaguerId(value: string) {
    this._leaguerId = value;
  }

  get leaguerName(): string {
    return this._leaguerName;
  }

  set leaguerName(value: string) {
    this._leaguerName = value;
  }

  get picBefore(): string {
    return this._picBefore;
  }

  set picBefore(value: string) {
    this._picBefore = value;
  }

  get picAfter(): string {
    return this._picAfter;
  }

  set picAfter(value: string) {
    this._picAfter = value;
  }

  get cuserDocId(): number {
    return this._cuserDocId;
  }

  set cuserDocId(value: number) {
    this._cuserDocId = value;
  }

  get cuserCareId(): number {
    return this._cuserCareId;
  }

  set cuserCareId(value: number) {
    this._cuserCareId = value;
  }

  get followUserId(): number {
    return this._followUserId;
  }

  set followUserId(value: number) {
    this._followUserId = value;
  }
}
