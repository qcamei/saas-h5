import {ZmMap} from "../../../comModule/AppUtils";

export class ZmtFormMonitor {

  private _canSubmit:boolean;
  private _failMap:ZmMap<Boolean> = new ZmMap<Boolean>();

  get canSubmit(): boolean {
    return this._failMap.size()==0;
  }

  get failMap(): ZmMap<Boolean> {
    return this._failMap;
  }

  public markChange(fieldName:string, success:boolean):void{
    if(success){
      this.failMap.remove(fieldName);
    }else{
      this.failMap.put(fieldName,true);
    }
  }

  public clear():void{
    this._failMap.clear();
  }

  constructor() { }
}



