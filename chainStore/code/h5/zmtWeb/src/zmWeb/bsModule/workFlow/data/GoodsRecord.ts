export class GoodsRecord {
  id:string;// prodId_recordType
  goodsId:string;
  count:number;
  price:number;
  discount:number;
  buserIds:Array<number>;
  recordType:number;
  createTime:number;
  restCount:number;//预存数量

  oldPrice:number;// 原价
  cost:number;// 总价 = 原价 X 个数
  pay:number;// 应结 = 售价 X 个数
}
