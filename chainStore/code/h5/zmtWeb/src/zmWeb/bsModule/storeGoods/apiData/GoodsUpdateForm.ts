export class GoodsUpdateForm {
  id: string;
  number: string;
  name: string;
  typeId: string;
  price: number;
  cost: number;
  state: number;
  descript: string;
  imgPaths: Array<String>;
  defaultImg: string;
  promotionFlag: number;//PromotionFlagEnum
  promotionPrice: number;

  constructor() {
  }
}
