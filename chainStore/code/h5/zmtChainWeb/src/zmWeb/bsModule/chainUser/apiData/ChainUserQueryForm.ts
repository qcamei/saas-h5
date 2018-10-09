import {Constants} from "../../../views/common/Util/Constants";
export class ChainUserQueryForm {
  constructor() {
  }

  chainId: string;
  phoneOrName: string;
  roleId: string = "-1";
  chainUserIds: Array<number>;
  crossClerks: Array<string> = new Array<string>();
  pageItemCount: number = Constants.DEFAULT_PAGEITEMCOUNT;
  pageNo: number;


}
