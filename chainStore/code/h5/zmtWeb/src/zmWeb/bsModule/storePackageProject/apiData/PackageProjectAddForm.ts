import {PackageItem} from "../../packageProjectDetail/data/PackageItem";
import {Constants} from "../../../views/common/Util/Constants";
export class PackageProjectAddForm {
  constructor() {
  }

  index: number;
  number: string;
  numberPass: boolean;
  name: string;
  namePass: boolean;
  typeId: string;
  state: number;
  sellPrice: number = 0;
  cost: number;
  defaultImg: string = Constants.PACKAGE_DEFAULT_IMG;
  descript: string;
  imgPaths: Array<string> = new Array<string>();
  packageItems: Array<PackageItem>;
  promotionFlag: number;//PromotionFlagEnum
  promotionPrice: number = 0;
}
