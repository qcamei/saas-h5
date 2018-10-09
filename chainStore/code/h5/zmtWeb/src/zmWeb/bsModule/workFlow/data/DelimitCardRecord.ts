export class DelimitCardRecord {
    delimitCardId:string;//划卡ID leaguerPrdCardId_pgId_itemType
    leaguerPrdCardId:string;//会员次卡id
    itemType:number;//ProductCardItemEnum
    pgId:string;
    count:number;
    remainder:number;//剩余次数
    createTime:number;
}
