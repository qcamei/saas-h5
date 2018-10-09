import {PackageItem} from "./PackageItem";
export class PackageProjectDetail {
  constructor() {
  }

  id: string;
  chainId: number;
  number: string;
  name: string;
  namePass:boolean;
  typeId: string;
  state: number;
  entityState: number;
  sellPrice: number;
  cost: number;
  defaultImg: string;
  descript: string;
  imgPaths: Array<string>;
  packageItems: Array<PackageItem>;
  applyStoreIds: Array<string>;
  createdTime: number;
  lastUpdateTime: number;
  ver: number;

  checked: boolean = false;

  targetId(): string {
    return this.id;
  }

}
