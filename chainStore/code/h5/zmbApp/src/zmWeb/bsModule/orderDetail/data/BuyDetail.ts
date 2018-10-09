export class BuyDetail {
  constructor() {
  }

  // 购买项ID buyType_pgId 方便退单时使用
  buyItemId: string;
  buyType: number;
  pgId: string;
  pgName: string;
  typeName: string;
  defaultImg: string;
  price: number;//售价
  count: number;
  discount: number;
  cost: number;//总价
  pay: number;//应结
  restCount: number;
}
