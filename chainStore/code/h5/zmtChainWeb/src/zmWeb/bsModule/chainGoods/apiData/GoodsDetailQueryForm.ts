
export class GoodsDetailQueryForm {
  constructor() {
  }

  minTime: number;
  maxTime: number;
  chainId: string;
  numberOrName: string;
  typeId: string = "-1";
  stateArray: Array<number> = new Array<number>();
  pageItemCount: number;
  pageNo: number;
}
