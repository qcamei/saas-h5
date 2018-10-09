export class UserBonus {
  // 医美师ID
  private _buserId: number;
  // 业绩金额
  private _amount: number;
  // 提成类型 BonusTypeEnum 固定提成 比例提成
  private _bonusType: number;
  // 提成比例
  private _percentage: number;
  // 提成金额
  private _cost: number;


  get buserId(): number {
    return this._buserId;
  }

  set buserId(value: number) {
    this._buserId = value;
  }

  get amount(): number {
    return this._amount;
  }

  set amount(value: number) {
    this._amount = value;
  }

  get bonusType(): number {
    return this._bonusType;
  }

  set bonusType(value: number) {
    this._bonusType = value;
  }

  get percentage(): number {
    return this._percentage;
  }

  set percentage(value: number) {
    this._percentage = value;
  }

  get cost(): number {
    return this._cost;
  }

  set cost(value: number) {
    this._cost = value;
  }
}
