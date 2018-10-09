import {WFCompInfo} from "./WFCompInfo";

export class WorkFlowType {
  id:number;
  wfCompName:string;
  wfCompInfos:Array<WFCompInfo>;
  createdTime:number;
  lastUpdateTime:number;
  ver:number;
  constructor(){}
}
