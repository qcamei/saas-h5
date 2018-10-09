export class ProductStatisticsItem {

  position:number;
  pgId: string;//产品ID
  pgName: string;//产品名字
  itemType: number;//BuyTypeEnum
  typeName: string;//分类名称
  salesVolume: number;//销售数量


  public addSalesVolume(salesVolume: number): void {
    this.salesVolume += salesVolume;
  }
}
