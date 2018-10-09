import {ZmMap} from "../../../comModule/AppUtils";
export class DetailDataVersion {
    constructor(){}
    id:string;
    storeId:string;
    detailDataVerMap:any;
    createdTime:number;
    lastUpdateTime:number;
    ver:number;

    public getDetailDataVerMap():ZmMap<number>{
      let detailDataVerMapTmp = new ZmMap<number>();
      for(let index in this.detailDataVerMap){
        let ver = this.detailDataVerMap[index];
        detailDataVerMapTmp.put(index,ver);
      }
      return detailDataVerMapTmp;
    }
}
