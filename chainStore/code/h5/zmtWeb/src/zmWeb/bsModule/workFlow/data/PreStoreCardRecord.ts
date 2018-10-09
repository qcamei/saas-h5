export class PreStoreCardRecord {
    constructor(){}
    id:string;//preStoreCardId_pgId_itemType
    preStoreCardId:string;//会员预存卡ID
    itemType:number;//ProductCardItemEnum
    pgId:string;
    count:number;
    createTime:number;
}
