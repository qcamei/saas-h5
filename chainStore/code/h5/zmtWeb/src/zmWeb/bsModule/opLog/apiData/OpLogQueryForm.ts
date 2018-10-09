export class OpLogQueryForm {
  storeId: number;
  buserName: string;
  name: string;
  type: number;
  minTime: number;
  maxTime: number;
  pageItemCount: number;
  pageNo: number;

  public static newInstance(): OpLogQueryForm {
    let data: OpLogQueryForm = new OpLogQueryForm();
    return data;
  }

}
