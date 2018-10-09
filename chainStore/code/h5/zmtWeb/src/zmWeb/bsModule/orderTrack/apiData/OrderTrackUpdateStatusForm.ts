export class OrderTrackUpdateStatusForm {
  /**
   * 物流状态
   * @link{OrderTrackStatusEnum}
   */
  status: number;
  //快递公司
  company: string;
  //快递单号
  courierNum: string;
}
