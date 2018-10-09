export class ProdRecord {
  // prodId_recordType
  private _id: string;
  // 项目ID
  private _prodId: string;
  // 项目个数
  private _count: number;
  // 价格
  private _price: number;
  // 折扣
  private _discount: number;
  // 记录类型 RecordTypeEnum
  private _recordType: number;
  // 创建时间
  private _createTime: number;
  // 预存数量
  private _restCount: number;


  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get prodId(): string {
    return this._prodId;
  }

  set prodId(value: string) {
    this._prodId = value;
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

  get restCount(): number {
    return this._restCount;
  }

  set restCount(value: number) {
    this._restCount = value;
  }
}
