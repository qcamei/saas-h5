export class ProductCard {
  constructor() {
  }

  id: string;
  number: string;
  name: string;
  typeId: string;
  status: number;
  entityState: number;
  sellPrice: number;
  imgPath: string;
  validPeriod: number;
  validPeriodUnit: number;
  applyStoreIds: Array<number>;
}
