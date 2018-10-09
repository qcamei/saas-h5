import {ZmMap} from "./AppUtils";


export class MgrPool{

  private static instance:MgrPool = new MgrPool();

  public static getInstance():MgrPool{
    return MgrPool.instance;
  }

  private mgrMap = new ZmMap<Object>();

  constructor() {
  }

  // public get<T>(tType: new() => T): any {
  //
  //   let key:string = tType.toString();
  //   if(!this.mgrMap.contains(key)){
  //     let tmp = new tType();
  //     this.mgrMap.put(key,tmp);
  //   }
  //
  //   return this.mgrMap.get(key);
  // }

  public get<T>(typeKey:string,tType: new() => T): any {

    // let key:string = tType.toString();
    if(!this.mgrMap.contains(typeKey)){
      let tmp = new tType();
      this.mgrMap.put(typeKey,tmp);
    }
    return this.mgrMap.get(typeKey);
  }

  public setNull<T>(typeKey:string,tType: new() => T): void {
    if(this.mgrMap.contains(typeKey)){
      this.mgrMap.put(typeKey,new tType());
    }
  }


}
