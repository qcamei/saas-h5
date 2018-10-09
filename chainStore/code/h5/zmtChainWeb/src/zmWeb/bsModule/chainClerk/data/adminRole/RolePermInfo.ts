import {AdminRole} from "./AdminRole";
export class RolePermInfo {
    constructor(){}
    userId:number;
    chainId:number;
    roles:Array<AdminRole>;
}
