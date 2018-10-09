import {ProductCardItem} from "./ProductCardItem";
export class ProductCardDetail {
  constructor() {
  }

  id: string;
  chainId: number;
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
  sellFlag: number;
  descript: string;
  imgPaths: Array<string>;
  productCardItems: Array<ProductCardItem>;
  applyStoreIds: Array<string>;
  splitMark: number;
  createdTime: number;
  lastUpdateTime: number;
  ver: number;

  checked: boolean = false;

  targetId(): string {
    return this.id;
  }
}
