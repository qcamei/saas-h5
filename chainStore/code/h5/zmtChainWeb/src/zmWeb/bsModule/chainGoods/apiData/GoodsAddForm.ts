import {Constants} from "../../../views/common/Util/Constants";
export class GoodsAddForm {
  constructor() {
  }

  index: number;
  number: string;
  numberPass: boolean;
  name: string;
  namePass: boolean;
  typeId: string;
  sellPrice: number = 0;
  state: number;
  defaultImg: string = Constants.GOODS_DEFAULT_IMG;
  applyStoreIds: Array<string>;
  cost: number = 0;
  descript: string;
  imgPaths: Array<string> = new Array<string>();
}
