export class BonusRecordForm {
  storeId: string;
  orderId: string;
  prdCardPayType: number;//PrdCardPayEnum
  buyType: number;//BuyTypeEnum
  pgId: string;
  userBonusMap: any;
  leaguerPrdCardId:string;

  //遗留
  productCardId: string;
  buyName: string;


  constructor() {
  }
}
