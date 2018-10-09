export class ChainDataQueryForm {
    constructor(){}
    chainId:number;
    storeId:string;
    numberOrName:string;
    typeId:string = "-1";//分类id
    synStatus:number = -1;//ChainDataStatusEnum
    pageItemCount:number = 10;
    pageNo:number = 1;
}
