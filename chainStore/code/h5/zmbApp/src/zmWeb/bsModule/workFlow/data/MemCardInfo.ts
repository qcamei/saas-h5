export class MemCardInfo {
  // 店铺会员卡类型ID
  private _memTypeId: string;
  // 充值金额
  private _cost: number;
  // 赠送金额
  private _largess: number;
  // 会员卡号
  private _number: string;
  // 服务人员
  private _buserIds: Array<number> = new Array<number>();
  // 有效期 eg：365天/1年
  private _limitTime: number;
  // 有效期时间的单位 对应LimitUnitEnum
  private _limitUnit: number;


  get memTypeId(): string {
    return this._memTypeId;
  }

  set memTypeId(value: string) {
    this._memTypeId = value;
  }

  get cost(): number {
    return this._cost;
  }

  set cost(value: number) {
    this._cost = value;
  }

  get largess(): number {
    return this._largess;
  }

  set largess(value: number) {
    this._largess = value;
  }

  get number(): string {
    return this._number;
  }

  set number(value: string) {
    this._number = value;
  }

  get buserIds(): Array<number> {
    return this._buserIds;
  }

  set buserIds(value: Array<number>) {
    this._buserIds = value;
  }

  get limitTime(): number {
    return this._limitTime;
  }

  set limitTime(value: number) {
    this._limitTime = value;
  }

  get limitUnit(): number {
    return this._limitUnit;
  }

  set limitUnit(value: number) {
    this._limitUnit = value;
  }
}
