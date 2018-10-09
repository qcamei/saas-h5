import {StoreLeaguerInfo} from "../../storeLeaguerInfo/data/StoreLeaguerInfo";
import {StoreCardInfo} from "../../storeCardInfo/data/StoreCardInfo";
import {StoreProductInfo} from "../../StoreProductInfo/data/StoreProductInfo";
import {StoreGoods} from "../../storeGoods/data/StoreGoods";
import {StoreClerkInfo} from "../../storeClerkInfo/data/StoreClerkInfo";
import {StatisticsData} from "./StatisticsData";

export class HomePage {
    constructor(){}
    storeLeaguer:StoreLeaguerInfo;
    storeCard:StoreCardInfo;
    storeProduct:StoreProductInfo;
    storeGoods:StoreGoods;
    storeClerk:StoreClerkInfo;
    // workFlowTypes:Array<WorkFlowType>;
    statisticsData:StatisticsData = new StatisticsData();
}
