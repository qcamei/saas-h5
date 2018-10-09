export class BonusRecordQueryForm {
  storeId:string;
  orderId:string;
  maxTime:string;
  minTime:string;
  buserName:string;
  statusSet:Array<number> = new Array<number>();
  buyId:string;
  pageItemCount:number=0;
  pageNo:number=1;
  constructor(){}
}
