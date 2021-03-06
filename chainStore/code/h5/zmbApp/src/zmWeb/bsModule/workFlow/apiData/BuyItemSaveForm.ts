export class BuyItemSaveForm {
// 购买类型 BuyTypeEnum
  private _buyType: number;
  // 项目/商品/次卡/套餐的ID
  private _pgId: string;
  // 原价
  private _oldPrice: number;
  // 数量
  private _count: number;
  // 折扣
  private _discount: number;

  // 预存数量
  private _restCount: number;


  get buyType(): number {
    return this._buyType;
  }

  set buyType(value: number) {
    this._buyType = value;
  }

  get pgId(): string {
    return this._pgId;
  }

  set pgId(value: string) {
    this._pgId = value;
  }

  get oldPrice(): number {
    return this._oldPrice;
  }

  set oldPrice(value: number) {
    this._oldPrice = value;
  }

  get count(): number {
    return this._count;
  }

  set count(value: number) {
    this._count = value;
  }

  get discount(): number {
    return this._discount;
  }

  set discount(value: number) {
    this._discount = value;
  }

  get restCount(): number {
    return this._restCount;
  }

  set restCount(value: number) {
    this._restCount = value;
  }
}
