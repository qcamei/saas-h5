import {ProductCardItem} from "../data/ProductCardItem";
export class AddProductCardForm {
  constructor() {
  }

  index: number;
  number: string;
  name: string;
  namePass: boolean;

  typeId: string;
  status: number;
  sellPrice: number;
  imgPath: string;
  validPeriod: number;
  validPeriodUnit: number = 1;
  descript: string;
  imgPaths: Array<string>;
  productCardItems: Array<ProductCardItem>;
  applyStoreIds: Array<string>;
}
