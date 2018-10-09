export class PackageProject {
  constructor() {
  }

  id: string;
  number: string;
  name: string;
  typeId: string;
  state: number;
  entityState: number;
  sellPrice: number;
  defaultImg: string;
  origin: number;// DataOriginEnum
  topFlag: number;//TopFlagEnum
  promotionFlag: number;//PromotionFlagEnum
  promotionPrice: number;

}
