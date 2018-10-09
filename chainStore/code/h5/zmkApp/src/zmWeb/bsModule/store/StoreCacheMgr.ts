import {ZmMap} from "../../comModule/AppUtils";
import {StoreMgr} from "./StoreMgr";
import {Store} from "./data/Store";
import {MgrPool} from "../../comModule/MgrPool";

export class StoreCacheMgr {

  public static getInstance():StoreCacheMgr{
    return MgrPool.getInstance().get("StoreCacheMgr",StoreCacheMgr);
  }

  private cacheMap:ZmMap<Store> = new ZmMap<Store>();

  public async get(id:string ):Promise<Store> {
    let cacheMgr = this;
    if(!this.cacheMap.contains(id)){
      await StoreMgr.getInstance().getStore(id).then((result: Store) =>{
        cacheMgr.cacheMap.put(id, result);
      });
    }
    return new Promise<Store>(resolve => {
      let target:Store = this.findFromCache(id);
      resolve(target);
    });
  }

  public clearAndAddListToCache(targetList:Array<Store>):void{
    this.clear();
    if(targetList != null){
      targetList.forEach((targetTmp:Store, index: number, array: Store[])=>{
        this.cacheMap.put(this.getId(targetTmp),targetTmp);
      });
    }
  }

  public getListFromCache(){
    return this.cacheMap.values();
  }

  private clear():void{
    this.cacheMap = new ZmMap<Store>();
  }

  private findFromCache(id:string ):Store{
    return this.cacheMap.get(id);
  }

  // public listToMap(itemArray:Array<Store>):ZmMap<Store>{
  //   let targetMap = new ZmMap<Store>();
  //   itemArray.forEach((itemTmp: Store, index: number, array: Store[])=>{
  //     targetMap.put(this.getId(itemTmp),itemTmp);
  //   });
  //   return targetMap;
  // }

  private getId( target:Store ):string {
    return target.id;
  }


}
