import {PayItem} from "../data/PayItem";
export class OrderAddByWorkflowDataIdForm {
    constructor(){}
    workFlowDataId:string;
    payItems:Array<PayItem>;
    remark:string;
}
