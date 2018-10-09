import {ZmMap} from "./AppUtils";


export class MgrPool{

  private static instance:MgrPool = new MgrPool();

  public static getInstance():MgrPool{
    return MgrPool.instance;
  }

  private mgrMap = new ZmMap<Object>();

  constructor() {
  }

  public get<T>(typeKey:string,tType: new() => T): any {

    // let key:string = tType.toString();
    if(!this.mgrMap.contains(typeKey)){
      let tmp = new tType();
      this.mgrMap.put(typeKey,tmp);
    }
    return this.mgrMap.get(typeKey);
  }



}
