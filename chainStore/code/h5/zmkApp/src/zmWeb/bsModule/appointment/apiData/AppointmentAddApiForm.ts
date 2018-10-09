import {AppointProduct} from "../data/AppointProduct";
import {AppUtils} from "../../../comModule/AppUtils";

export class AppointmentAddApiForm {
  storeId: string; // 店铺ID
  cuserId:string;
  appointTime: number; // 预约时间
  appointProducts:Array<AppointProduct>; // 多个项目


  // leaguerId: string; // 客户ID (前台可以不传)
  // creatorId: string; // 创建者ID (前台可以不传)
  // creatorName: string; // 创建者名称 (前台可以不传)

  constructor() {
  }

  public isValidAppointProducts(): boolean {
    if (!AppUtils.isNullObj(this.appointProducts) && this.appointProducts.length > 0) {
      return true;
    }
    return false;
  }

}
