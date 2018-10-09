import {OrderUpdateInfoApiForm} from "./OrderUpdateInfoApiForm";
import {OrderUpdateStatusApiForm} from "./OrderUpdateStatusApiForm";
import {UpdateOrderMaterialForm} from "./UpdateOrderMaterialForm";
import {OrderUpdatePayItemApiForm} from "./OrderUpdatePayItemApiForm";
import {PayOrderWithNoteApiForm} from "./PayOrderWithNoteApiForm";

export class OrderUpdateApiForm {
  storeId:string;
  updateType:number;
  updateInfoData:OrderUpdateInfoApiForm;
  updateStatusData:OrderUpdateStatusApiForm;
  updateOrderMaterialData:UpdateOrderMaterialForm;
  updatePayItemApiForm:OrderUpdatePayItemApiForm;
  payOrderWithNoteApiForm:PayOrderWithNoteApiForm;//订单支付，添加备注信息
  constructor(){}
}
