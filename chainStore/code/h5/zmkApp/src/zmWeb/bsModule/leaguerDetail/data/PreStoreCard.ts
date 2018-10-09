import {LeaguerPrdCardItem} from "../../storeLeaguerInfo/data/LeaguerPrdCardItem";
export class PreStoreCard {
    constructor(){}
    id:string;
    orderId:string;
    state:number;
    createdTime:number;
    leaguerPrdCardItems:Array<LeaguerPrdCardItem>;
}
