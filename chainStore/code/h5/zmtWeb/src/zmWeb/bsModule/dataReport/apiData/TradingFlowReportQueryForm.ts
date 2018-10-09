export class TradingFlowReportQueryForm {
  storeId: string;
  maxTime: string;
  minTime: string;
  queryName: string;

  pageItemCount: number = 10;
  pageNo: number = 1;

  payType:Array<number> = [];
  tradeType:Array<number> = [];

  constructor() {
  }
}
