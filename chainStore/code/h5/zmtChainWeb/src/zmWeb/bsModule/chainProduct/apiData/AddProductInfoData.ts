import {Constants} from "../../../views/common/Util/Constants";
export class AddProductInfoData {
  constructor() {
  }

  index: number;
  number: string;
  numberPass:boolean;
  name: string;
  namePass: boolean;

  typeId: string;
  sellPrice: number = 0;
  state: number;
  defaultImg: string = Constants.PRODUCT_DEFAULT_IMG;
  cost: number = 0;
  descript: string;
  imgPathList: Array<string> = new Array<string>();
  applyStoreIds: Array<string>;
}
