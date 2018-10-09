import {ProductCardItem} from "../../productCardDetail/data/ProductCardItem";
export class UpdProductCardForm {
  constructor() {
  }

  id: string;
  number: string;
  name: string;
  typeId: string;
  status: number;
  sellPrice: number;
  imgPath: string;
  validPeriod: number;
  validPeriodUnit: number;
  descript: string;
  imgPaths: Array<string>;
  productCardItems: Array<ProductCardItem>;
  promotionFlag: number;//PromotionFlagEnum
  promotionPrice: number;
}
