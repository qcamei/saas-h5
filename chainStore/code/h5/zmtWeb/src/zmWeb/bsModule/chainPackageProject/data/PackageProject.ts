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
  applyStoreIds: Array<number>;
  topFlag: number;//TopFlagEnum
  promotionFlag: number;//PromotionFlagEnum
  promotionPrice: number;
}
