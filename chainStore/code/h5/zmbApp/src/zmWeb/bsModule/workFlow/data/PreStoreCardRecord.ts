export class PreStoreCardRecord {
  // 划卡ID preStoreCardId_pgId_itemType
  private _id: string;
  // 客户预存卡ID
  private _preStoreCardId: string;
  // 类型 ProductCardItemEnum
  private _itemType: number;
  // 项目、商品、套餐ID
  private _pgId: string;
  // 抵消次数
  private _count: number;
  // 创建时间
  private _createTime: number;


  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get preStoreCardId(): string {
    return this._preStoreCardId;
  }

  set preStoreCardId(value: string) {
    this._preStoreCardId = value;
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
