export class BuyDetail {
  constructor() {
  }

  buyItemId: string;
  buyType: number;//BuyTypeEnum
  pgId: string;
  pgName: string;
  oldPrice: number;
  price: number;
  count: number;
  discount: number;
  cost: number;// 总价
  pay: number;// 应结
  restCount: number;//预存
  defaultImg: string;//默认图片
  typeName: string;//类型名称
}
