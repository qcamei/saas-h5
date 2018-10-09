import {Constants} from "../../../views/common/Util/Constants";
export class ProductDetailQueryForm{
  minTime: string = Constants.DEFAULT_TIME_VALUE;
  maxTime: string = Constants.DEFAULT_TIME_VALUE;

  storeId: string;
  numberOrName:string;
  typeId: string = Constants.DEFAULT_TYPE_VALUE;
  state: number = Constants.DEFAULT_STATE_VALUE;//ProductInfoState

  pageItemCount: number = Constants.DEFAULT_PAGEITEMCOUNT;
  pageNo: number = Constants.DEFAULT_PAGENO;
}

