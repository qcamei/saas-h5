export class DelimitCardRecord {
  // 划卡ID leaguerPrdCardId_pgId_itemType
  private _delimitCardId: string;
  // 客户次卡ID
  private _leaguerPrdCardId: string;
  // 类型 ProductCardItemEnum
  private _itemType: number;
  // 项目、商品、套餐ID
  private _pgId: string;
  // 抵消次数
  private _count: number;
  // 创建时间
  private _createTime: number;


  get delimitCardId(): string {
    return this._delimitCardId;
  }

  set delimitCardId(value: string) {
    this._delimitCardId = value;
  }

  get leaguerPrdCardId(): string {
    return this._leaguerPrdCardId;
  }

  set leaguerPrdCardId(value: string) {
    this._leaguerPrdCardId = value;
  }

  get itemType(): number {
    return this._itemType;
  }

  set itemType(value: number) {
    this._itemType = value;
  }

  get pgId(): string {
    return this._pgId;
  }

  set pgId(value: string) {
    this._pgId = value;
  }

  get count(): number {
    return this._count;
  }

  set count(value: number) {
    this._count = value;
  }

  get createTime(): number {
    return this._createTime;
  }

  set createTime(value: number) {
    this._createTime = value;
  }
}
