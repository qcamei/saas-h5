export class ProductInfo {

  id: string;
  name: string = "";
  number: string;//编号
  typeId: string;
  price: number;
  state: number;
  entityState: number;
  defaultImg: string;
  origin: number;// DataOriginEnum
  topFlag: number;//TopFlagEnum
  promotionFlag: number;//PromotionFlagEnum
  promotionPrice: number;


  //展示数据
  checked: boolean;

  constructor() {
  }
}
