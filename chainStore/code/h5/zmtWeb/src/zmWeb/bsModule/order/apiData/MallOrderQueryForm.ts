/**
 * 商城订单查询表单
 */
export class MallOrderQueryForm {
  storeId: number;
  minTime: number;
  maxTime: number;

  numberOrName: string;
  // OrderTrackStatusEnum
  status: Array<number> = new Array<number>();
  leaguerId: string;

  pageItemCount: number;
  pageNo: number;
}
