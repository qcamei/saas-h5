export class ProductCardDetailQueryForm {
  constructor() {
  }

  minTime: number;
  maxTime: number;
  chainId: string;
  typeId: string = "-1";
  statusSet: Array<number> = new Array<number>();
  cardNameOrNumber: string;
  pageItemCount: number;
  pageNo: number;
}
