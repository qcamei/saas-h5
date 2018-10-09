import {LeaguerBaseAttribute} from "./leaguer/LeaguerBaseAttribute";
import {ZmMap} from "../../../comModule/AppUtils";
import {LeaguerOriginConfig} from "./leaguer/LeaguerOriginConfig";
import {LeaguerTypeConfig} from "./leaguer/LeaguerTypeConfig";
import {LeaguerExpandAttribute} from "./leaguer/LeaguerExpandAttribute";
import {LeaguerAnalysisConfig} from "./leaguer/LeaguerAnalysisConfig";

export class LeaguerConfig {
  leaguerOriginConfigIndex:number;
  leaguerOriginConfigMap:any;
  leaguerAnalysisConfigIndex:number;
  leaguerAnalysisConfigMap:any;
  leaguerBaseAttributes:Array<LeaguerBaseAttribute>;
  leaguerExpandAttributeIndex:number;
  leaguerExpandAttributeMap:any;

  /*************************遗留字段*******************************/
  leaguerTypeConfigIndex:number;
  leaguerTypeConfigMap:any;
constructor(){}

  public getLeaguerOriginMap():ZmMap<LeaguerOriginConfig>{
    let originMap = new ZmMap<LeaguerOriginConfig>();
    for (let index in this.leaguerOriginConfigMap) {
      let item = this.leaguerOriginConfigMap[index];
      originMap.put(item.id, item);
    }
    return originMap;
  }

  public getLeaguerTypeMap():ZmMap<LeaguerTypeConfig>{
    let typeMap = new ZmMap<LeaguerTypeConfig>();
    for (let index in this.leaguerTypeConfigMap) {
      let item = this.leaguerTypeConfigMap[index];
      typeMap.put(item.id, item);
    }
    return typeMap;
  }

  public getLeaguerExpandAttributeMap():ZmMap<LeaguerExpandAttribute>{
    let expandAttributeMap = new ZmMap<LeaguerExpandAttribute>();
    for (let index in this.leaguerExpandAttributeMap) {
      let item = this.leaguerExpandAttributeMap[index];
      expandAttributeMap.put(item.id, item);
    }
    return expandAttributeMap;
  }

  public getBaseAttributeMap():ZmMap<LeaguerBaseAttribute>{
    let baseAttributeMap = new ZmMap<LeaguerBaseAttribute>();
    for (let i=0;i<this.leaguerBaseAttributes.length;i++) {
      let item = this.leaguerBaseAttributes[i];
      baseAttributeMap.put(item.attributeName, item);
    }
    return baseAttributeMap;
  }

  public getLeaguerAnalysisMap():ZmMap<LeaguerAnalysisConfig>{
    let tmpMap = new ZmMap<LeaguerAnalysisConfig>();
    for (let index in this.leaguerAnalysisConfigMap) {
      let item = this.leaguerAnalysisConfigMap[index];
      tmpMap.put(item.id, item);
    }
    return tmpMap;
  }

}
