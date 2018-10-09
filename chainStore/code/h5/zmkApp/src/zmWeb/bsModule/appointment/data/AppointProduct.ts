import {OperateTypeEnum} from "./OperateTypeEnum";
import {ProductItemData} from "../../../views/appointment/AppointmentViewData";

export class AppointProduct {
  productId: string; // 项目ID
  productCount: number; // 项目数量
  operateType: number;//OperateTypeEnum 0 现结 1划卡
  buserIds: Array<string>; // 服务人员

  /***************遗留字段***********************/
  productName:string;//项目名
  productCardId: string;//次卡id
  leaguerPrdCardId:string;//客户次卡
  constructor() {
  }

  public static from(productItem: ProductItemData){
    let instance = new AppointProduct();
    instance.productId = productItem.id;
    instance.productName = productItem.name;
    instance.productCount = productItem.count;
    instance.operateType = OperateTypeEnum.CASH;
    let buserIds = [];
    productItem.staffList.forEach(item=>{
      if(item.selected){
        buserIds.push(item.id)
      }
    })
    if(buserIds.length>0){
      instance.buserIds = buserIds;
    }
    return instance;
  }
}
