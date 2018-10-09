import {ProductCardItem} from "./ProductCardItem";
export class ProductCardDetail {
  constructor() {
  }

  id: string;
  storeId: number;
  number: string;
  name: string;
  namePass: boolean;
  typeId: string;
  status: number;
  entityState: number;
  sellPrice: number;
  imgPath: string;
  validPeriod: number;
  validPeriodUnit: number;
  sellFlag: number;//SellFlagEnum
  descript: string;
  origin: number;// DataOriginEnum
  topFlag: number;//TopFlagEnum
  promotionFlag: number;//PromotionFlagEnum
  promotionPrice: number;
  imgPaths: Array<string>;
  productCardItems: Array<ProductCardItem>;

  createdTime: number;
  lastUpdateTime: number;
  ver: number;


  checked: boolean = false;

  targetId(): string {
    return this.id;
  }
}
