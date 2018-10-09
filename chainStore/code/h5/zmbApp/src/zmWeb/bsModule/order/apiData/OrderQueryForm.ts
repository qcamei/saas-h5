import {Constants} from "../../../views/zmComUtils/Constants";
import {OrderTypeEnum} from "../data/OrderTypeEnum";
export class OrderQueryForm {
  constructor() {
  }

  storeId: string;
  buserId: string;
  pageItemCount: number = Constants.DEFAULT_PAGEITEMCOUNT;
  pageNo: number = Constants.DEFAULT_PAGENO;
  status: Array<number> = new Array<number>();//OrderStatusEnum
  origin: Array<number> = new Array<number>();//OrderOriginEnum

  cuserId: string;
  orderType: number;//OrderTypeEnum
  leaguerId: string;
  numberOrName: string;
  minTime: number = 0;
  maxTime: number = 0;
}
