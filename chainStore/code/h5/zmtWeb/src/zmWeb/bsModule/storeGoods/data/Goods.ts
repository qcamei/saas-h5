export class Goods {
  id: string;
  number: string;
  name: string;
  typeId: string;
  state: number;//GoodsStateEnum
  entityState: number;
  price: number;
  defaultImg: string;
  origin: number;// DataOriginEnum
  topFlag: number;//TopFlagEnum
  promotionFlag: number;//PromotionFlagEnum
  promotionPrice: number;


  //展示属性
  checked: boolean;

  constructor() {
  }
}
