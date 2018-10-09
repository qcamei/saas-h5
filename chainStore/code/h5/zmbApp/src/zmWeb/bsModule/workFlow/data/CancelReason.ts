export class LeaguerInfo {
  // 操作员ID
  private _operatorId: number;
  // 操作员名称
  private _operator: string;
  // 作废原因
  private _cancelReason: string;


  get operatorId(): number {
    return this._operatorId;
  }

  set operatorId(value: number) {
    this._operatorId = value;
  }

  get operator(): string {
    return this._operator;
  }

  set operator(value: string) {
    this._operator = value;
  }

  get cancelReason(): string {
    return this._cancelReason;
  }

  set cancelReason(value: string) {
    this._cancelReason = value;
  }
}
