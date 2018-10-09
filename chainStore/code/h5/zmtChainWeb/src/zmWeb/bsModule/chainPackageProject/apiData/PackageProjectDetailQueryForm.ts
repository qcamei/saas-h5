export class PackageProjectDetailQueryForm {
    constructor(){}
    minTime:number;
    maxTime:number;
    chainId:string;
    statusSet:Array<number> = new Array<number>();
    nameOrNumber:string;
    typeId:string = "-1";
    pageItemCount:number;
    pageNo:number;
}
