export class LeaguerSaveForm {
// 客户ID
  private _leaguerId: string;
  // 跟进人员
  private _followUserId: number;


  get leaguerId(): string {
    return this._leaguerId;
  }

  set leaguerId(value: string) {
    this._leaguerId = value;
  }

  get followUserId(): number {
    return this._followUserId;
  }

  set followUserId(value: number) {
    this._followUserId = value;
  }
}
