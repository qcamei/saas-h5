export class UpdateProductInfoData {

  id: string;
  number: string;
  storeId: string;
  name: string;
  typeId: string;
  cost: number;
  price: number;
  state: number;
  descript: string;
  imgPathList: Array<string>;
  defaultImg: string;
  promotionFlag: number;//PromotionFlagEnum
  promotionPrice: number;

  constructor() {
  }
}
