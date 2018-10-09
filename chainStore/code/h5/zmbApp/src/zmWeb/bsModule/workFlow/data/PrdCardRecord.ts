export class PrdCardRecord {
  // prdCardTypeId_recordType
  private _id: string;
  // 店铺次卡类型的ID
  private _prdCardTypeId: string;
  // 次卡个数
  private _count: number;
  // 价格
  private _price: number;
  // 折扣
  private _discount: number;
  // 记录类型 RecordTypeEnum
  private _recordType: number;
  // 创建时间
  private _createTime: number;


  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get prdCardTypeId(): string {
    return this._prdCardTypeId;
  }

  set prdCardTypeId(value: string) {
    this._prdCardTypeId = value;
  }

  get count(): number {
    return this._count;
  }

  set count(value: number) {
    this._count = value;
  }

  get price(): number {
    return this._price;
  }

  set price(value: number) {
    this._price = value;
  }

  get discount(): number {
    return this._discount;
  }

  set discount(value: number) {
    this._discount = value;
  }

  get recordType(): number {
    return this._recordType;
  }

  set recordType(value: number) {
    this._recordType = value;
  }

  get createTime(): number {
    return this._createTime;
  }

  set createTime(value: number) {
    this._createTime = value;
  }
}
