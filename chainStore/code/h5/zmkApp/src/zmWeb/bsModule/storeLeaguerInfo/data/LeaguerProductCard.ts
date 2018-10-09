import {LeaguerPrdCardItem} from "./LeaguerPrdCardItem";
import {ProductCardItem} from "../../productCardDetail/data/ProductCardItem";
export class LeaguerProductCard {
    constructor(){}
    id:string;
    cardId:string;
    purchaseTime:number;
    endTime:number;
    state:number;
    createdTime:number;
    leaguerPrdCardItems:Array<LeaguerPrdCardItem>;//次卡内容



    //遗留数据
    productCardItems:Array<ProductCardItem>;
    useCountMap:any;
    count:number;
}
