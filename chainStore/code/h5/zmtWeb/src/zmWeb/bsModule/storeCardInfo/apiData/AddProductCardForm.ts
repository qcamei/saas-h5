import {ProductCardItem} from "../../productCardDetail/data/ProductCardItem";
export class AddProductCardForm {
  constructor() {
  }

  index: number;
  number: string;
  name: string;
  namePass: boolean;
  typeId: string;
  status: number;
  sellPrice: number = 0;
  imgPath: string;
  validPeriod: number;
  validPeriodUnit: number = 2;
  descript: string;
  imgPaths: Array<string>;
  productCardItems: Array<ProductCardItem>;
  promotionFlag: number;//PromotionFlagEnum
  promotionPrice: number = 0;
}
