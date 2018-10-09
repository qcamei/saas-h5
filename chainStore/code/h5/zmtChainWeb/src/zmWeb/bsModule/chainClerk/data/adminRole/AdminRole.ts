export class AdminRole {
    constructor(){}
    id:string;
    name:string;
    chainId:number;
    descript:string;
    state:number;//AdminRoleState
    permSet:Array<number>;//AdminPermEnum
    createdTime:number;
    lastUpdateTime:number;
}
