export class SellProductQueryForm {
    constructor(){}
    chainId:string;
    numberOrName:string;
    typeId:string;
    stateArray:Array<number> = new Array<number>();//SellProductStateEnum
    sellProductTypeArray:Array<number> = new Array<number>();
    pageItemCount:number;
    pageNo:number;
}
