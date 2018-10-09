import {AdminRole} from "../../chainClerk/data/adminRole/AdminRole";
export class ChainUserDto {
    constructor(){}
    id:number;
    name:string;
    areaCode:string;
    phone:string;
    headImg:string;
    gender:number;
    birthday:string;
    crossClerk:number;
    storeIds:Array<string>;
    storeNames:Array<string>;
    adminRoles:Array<AdminRole>;
}
