import {MembershipCardDetail} from "../../MembershipCardDetail/data/MembershipCardDetail";
import {ProductCardDetail} from "../../productCardDetail/data/ProductCardDetail";
export class StoreCardDetail {
    constructor(){}
    id:number;
    storeId:number;
    membershipCardIndex:number;
    productCardIndex:number;
    membershipCardMap:Array<MembershipCardDetail>;
    productCardMap:Array<ProductCardDetail>;
    splitMark:number;
    createdTime:number;
    lastUpdateTime:number;
    ver:number;
}
