export class BuyItem {
  buyItemId: string;// 购买项ID buyType_pgId 方便退单时使用
  buyType: number;//BuyTypeEnum
  pgId: string;
  price: number;// 售价
  count: number;
  discount: number;
  cost: number;// 总价
  pay: number;// 应结
  restCount:number;//预存数量

  //遗留字段
  buserIds: Array<string>;
  pgName: string;
  prdCardId: string;
  payName: string;

  constructor() {
  }
}



