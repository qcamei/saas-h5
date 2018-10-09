export class MembershipCardDetailQueryForm {
  constructor() {
  }

  minTime: number;
  maxTime: number;
  chainId: string;
  statusSet: Array<number> = new Array<number>();
  cardNameOrNumber: string;
  pageItemCount: number;
  pageNo: number;
}
