export class AppointmentAddApiForm {
  storeId: string;
  leaguerId: string;
  appointTime: number;
  appointProducts:Array<AppointProduct>;
  creatorId: string;
  creatorName: string;

  constructor() {
  }
}

export class AppointProduct {
  productId: string;
  productCount: number;
  operateType: number;//OperateTypeEnum 0 现结 1划卡
  productCardId: string;
  buserIds: Array<string>;
}
