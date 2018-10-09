import {DynamicItem} from "../data/DynamicItem";
export class DynamicAddForm {
    constructor(){}
    storeId:string;
    buserId:string;
    status:number;
    docContent:string;
    imgPaths:Array<string>;
    dynamicItems:Array<DynamicItem>;
}
