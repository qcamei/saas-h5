export class OrderQueryForm {

  storeId: string = "";
  numberOrName: string = "";
  orderType: number = -1;
  // orderType: number = OrderTypeEnum.PURCHASE;
  status: string = "";
  minTime: string = "0";
  maxTime: string = "0";
  pageItemCount: number = 10;
  pageNo: number = 1;

  cuserId: string = "0";
  leaguerId: string = "";

  constructor() {
  }
}
