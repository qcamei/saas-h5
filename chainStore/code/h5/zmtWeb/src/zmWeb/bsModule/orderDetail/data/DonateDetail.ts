export class DonateDetail {
  constructor() {
  }

  donationItemId: string;
  buyType: number;//BuyTypeEnum
  pgId: string;
  pgName: string;
  price: number;
  count: number;
  cost: number;// 总价
  defaultImg: string;//默认图片
  typeName: string;//类型名称
}
