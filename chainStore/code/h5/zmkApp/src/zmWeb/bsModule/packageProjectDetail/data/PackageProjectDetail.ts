import {PackageItem} from "./PackageItem";
export class PackageProjectDetail {
  constructor() {
  }

  id: string;
  storeId: number;
  number: string;
  name: string;
  typeId: string;
  state: number;
  entityState: number;
  sellPrice: number;
  cost: number;
  defaultImg: string;
  descript: string;
  imgPaths: Array<string>;
  packageItems: Array<PackageItem>;
  origin: number;// DataOriginEnum
  topFlag: number;//TopFlagEnum
  promotionFlag: number;//PromotionFlagEnum
  promotionPrice: number;

  createdTime: number;
  lastUpdateTime: number;
  ver: number;

  checked: boolean = false;

  targetId(): string {
    return this.id;
  }
}
