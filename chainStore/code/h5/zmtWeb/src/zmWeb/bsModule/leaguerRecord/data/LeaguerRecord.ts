import {RelateOrder} from "./RelateOrder";
import {RelateProduct} from "./RelateProduct";
export class LeaguerRecord {
    constructor(){}
    id:string;
    storeId:string;
    leaguerId:string;
    title:string;
    content:string;
    imgPaths:Array<string>;
    relateOrder:RelateOrder;// 关联订单
    relateProduct:RelateProduct;// 关联项目
    workFlowDataId:string;
    creatorId:string;
    creatorName:string;
    createdTime:number;
    lastUpdateTime:number;
    ver:number;
}
