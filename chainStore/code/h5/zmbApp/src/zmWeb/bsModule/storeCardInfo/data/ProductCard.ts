export class ProductCard {
  constructor() {
  }

  id: string;
  number: string;
  name: string;
  typeId: string;
  status: number;//CardStatusEnum
  entityState: number;
  sellPrice: number;
  imgPath: string;
  validPeriod: number;
  validPeriodUnit: number;//ValidPeriodUnitEnum
  origin: number;// DataOriginEnum
  topFlag: number;//TopFlagEnum
  promotionFlag: number;//PromotionFlagEnum
  promotionPrice: number;

}
