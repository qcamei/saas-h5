import {PackageItem} from "../data/PackageItem";
export class PackageProjectUpdateForm {
  constructor() {
  }

  id: string;
  number: string;
  name: string;
  typeId: string;
  state: number;
  sellPrice: number;
  cost: number;
  defaultImg: string;
  descript: string;
  imgPaths: Array<string>;
  packageItems: Array<PackageItem>;
  applyStoreIds: Array<string>;
}
