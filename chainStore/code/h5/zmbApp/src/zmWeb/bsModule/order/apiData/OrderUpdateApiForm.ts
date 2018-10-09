import {OrderUpdateInfoApiForm} from "./OrderUpdateInfoApiForm";
import {OrderUpdateStatusApiForm} from "./OrderUpdateStatusApiForm";
import {OrderUpdatePayItemApiForm} from "./OrderUpdatePayItemApiForm";
import {OrderDeleteForm} from "./OrderDeleteForm";
import {PayOrderWithNoteApiForm} from "./PayOrderWithNoteApiForm";
export class OrderUpdateApiForm {
    constructor(){}
    storeId:string;
    updateType:number;
    updateInfoData:OrderUpdateInfoApiForm;
    updateStatusData:OrderUpdateStatusApiForm;
    updatePayItemApiForm:OrderUpdatePayItemApiForm;
    orderDeleteForm:OrderDeleteForm;
    payOrderWithNoteApiForm:PayOrderWithNoteApiForm;
    // updateOrderMaterialData:UpdateOrderMaterialForm;
}
