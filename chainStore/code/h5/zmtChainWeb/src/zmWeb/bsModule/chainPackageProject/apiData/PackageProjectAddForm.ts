import {PackageItem} from "../data/PackageItem";
export class PackageProjectAddForm {
  constructor() {
  }

  index: number;
  number: string;
  name: string;
  namePass:boolean;

  typeId: string;
  state: number;
  sellPrice: number = 0;
  cost: number;
  defaultImg: string;
  descript: string;
  imgPaths: Array<string>;
  packageItems: Array<PackageItem>;
  applyStoreIds: Array<string>;
}
