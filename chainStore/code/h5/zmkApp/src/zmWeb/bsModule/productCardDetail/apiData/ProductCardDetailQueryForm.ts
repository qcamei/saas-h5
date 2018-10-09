import {Constants} from "../../../views/zmComUtils/Constants";
export class ProductCardDetailQueryForm {
  constructor() {
  }

  minTime: string = Constants.DEFAULT_TIME_VALUE;
  maxTime: string = Constants.DEFAULT_TIME_VALUE;
  storeId: string;
  pageItemCount: number = Constants.DEFAULT_PAGENO;
  pageNo: number = Constants.DEFAULT_PAGEITEMCOUNT;
  cardNameOrNumber: string;
  statusSet: Array<number> = new Array<number>();//CardStatusEnum
  typeId:string = Constants.DEFAULT_TYPE_VALUE;
}
