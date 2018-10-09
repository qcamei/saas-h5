import {AppointConfig} from "./AppointConfig";
import {LeaguerConfig} from "./LeaguerConfig";
export class StoreConfig {
id:string;
storeId:string;
appointConfig:AppointConfig;
leaguerConfig:LeaguerConfig;
createdTime:number;
lastUpdateTime:number;
ver:number;
constructor(){}
}
