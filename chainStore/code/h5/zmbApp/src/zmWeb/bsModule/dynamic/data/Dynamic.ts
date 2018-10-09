import {DynamicItem} from "./DynamicItem";
export class Dynamic {
    constructor(){}
    id:number;
    storeId:number;
    buserId:number;
    status:number;
    docContent:string;
    imgPaths:Array<string> = new Array<string>();
    dynamicItems:Array<DynamicItem>;
    entityState:number;
    createdTime:number;
    lastUpdateTime:number;
    ver:number;
}
