export class DelimitCardDetail {
  constructor() {
  }

  delimitCardItemId: string;
  itemType: number;//ProductCardItemEnum
  pgId: string;
  pgName: string;
  price: number;
  leaguerPrdCardId: string;//会员次卡的ID
  prdCardName: string;
  count: number;//消费次数
  defaultImg: string;//默认图片
  typeName: string;//类型名称
}
