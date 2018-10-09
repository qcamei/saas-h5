import {ProductItemData} from "../../../views/appointment/productSelectList/productSelectList.page";
import {OperateTypeEnum} from "./OperateTypeEnum";

export class AppointProduct {
  productId: string;
  productCount: number;
  operateType: number; //OperateTypeEnum 0 现结 1划卡
  productCardId: string;
  buserIds: Array<string>;

  constructor() {
  }

  public static from(productItem: ProductItemData){
    let instance = new AppointProduct();
    instance.productId = productItem.id;
    instance.productCount = productItem.count;
    instance.operateType = OperateTypeEnum.CASH;
    instance.buserIds = productItem.staffIds;
    return instance;
  }
}
