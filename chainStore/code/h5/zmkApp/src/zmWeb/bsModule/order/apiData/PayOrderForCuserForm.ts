import {PayItem} from "../data/PayItem";
import {Order} from "../data/Order";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
export class PayOrderForCuserForm {
    constructor(){}
    payItems:Array<PayItem>;
    storeId:string;
    orderId:string;
    creatorId:string;

    public static from(order: Order):PayOrderForCuserForm{
      let instance = new PayOrderForCuserForm();
      instance.payItems = order.payItems;
      instance.storeId = SessionUtil.getInstance().getCurStoreId();
      instance.orderId = order.id;
      instance.creatorId = SessionUtil.getInstance().getLoginCUserId();
      return instance;
    }
}
