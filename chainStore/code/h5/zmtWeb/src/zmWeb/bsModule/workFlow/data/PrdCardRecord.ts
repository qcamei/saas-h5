export class PrdCardRecord {
  id:string;// prodId_recordType
  prdCardTypeId:string;
  count:number;
  price:number;
  discount:number;
  recordType:number;//RecordTypeEnum
  createTime:number;
  oldPrice:number;// 原价
  cost:number;// 总价 = 原价 X 个数
  pay:number;// 应结 = 售价 X 个数
  /********************** 遗留字段 **********************/
  buserIds:Array<number>;
}
