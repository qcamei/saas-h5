export enum SysInitReasonEnum {
  Other=0,//(1, "其他"),
  Redo=1,//(2, "重新预约"),
  Conflict=2,//(3, "预约冲突"),
  Personal=3,//(4, "顾客个人原因"),
}

export class SysInitReason{
  public static readonly OTHER = "其他";
}
