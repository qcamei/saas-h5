import {Constants} from "../../../views/zmComUtils/Constants";
import {OrderTypeEnum} from "../data/OrderTypeEnum";
export class OrderQueryForm {
  constructor() {
  }

  storeId: string;
  cuserId: string;
  orderType: number = OrderTypeEnum.PURCHASE;//OrderTypeEnum
  pageItemCount: number = Constants.DEFAULT_PAGEITEMCOUNT;
  pageNo: number = Constants.DEFAULT_PAGENO;
  status: Array<number> = new Array<number>();//OrderStatusEnum
  origin: Array<number> = new Array<number>();//OrderOriginEnum
  leaguerId: string;

  buserId: number;
  numberOrName: string;
  minTime: number;
  maxTime: number;
}
