export class IncomePayQueryForm {
    constructor(){}
    storeId:string;
    category:number;
    minIncomePayTime:string = "0";
    maxIncomePayTime:string = "0";
    minMoney:number;
    maxMoney:number;
    buserId:number;
    typeId:string;
    pageItemCount:number = 10;
    pageNo:number = 1;
}
