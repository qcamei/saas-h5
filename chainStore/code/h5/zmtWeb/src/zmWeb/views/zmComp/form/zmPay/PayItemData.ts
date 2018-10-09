export class PayItemData{
  public outTradeNo:string;//线上支付生成的唯一订单号
  public payType:number;
  public value:number;
  public isSelect:boolean = false;
  public canEdit:boolean = true;
  constructor(typeP:number){
    this.payType = typeP;
  }
}
