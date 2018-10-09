import {Constants} from "../../../views/common/Util/Constants";
export class GoodsDetailQueryForm {
  minTime: string = Constants.DEFAULT_TIME_VALUE;
  maxTime: string = Constants.DEFAULT_TIME_VALUE;
  storeId: string;

  numberOrName:string;
  typeId: string = Constants.DEFAULT_TYPE_VALUE;
  // 状态 对应GoodsStateEnum
  state: number = Constants.DEFAULT_STATE_VALUE;

  pageItemCount: number = Constants.DEFAULT_PAGENO;
  pageNo: number = Constants.DEFAULT_PAGEITEMCOUNT;
}
