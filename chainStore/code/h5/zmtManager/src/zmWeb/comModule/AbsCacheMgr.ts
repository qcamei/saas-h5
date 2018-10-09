
import {ZmMap, AppUtils} from "./AppUtils";


export class AbsCacheMgr<T> {

  private cacheMap:ZmMap<T> = new ZmMap<T>();
  //需要刷新，重新获取的id列表
  private refreshList:Array<string> = new Array<string>();

  public clear():void{
    this.cacheMap = new ZmMap<T>();
    //需要刷新，重新获取的id列表
    this.refreshList= new Array<string>();
  }

  public addRefreshList(idArray:Array<string>):void{
    this.refreshList = AppUtils.addAll(this.refreshList,idArray);
    this.refreshList = AppUtils.uniquelize(this.refreshList);
  }

  public addRefreshId(id:string):void{
    if(!AppUtils.arrayContains(this.refreshList,id)){
      this.refreshList.push(id);
    }
  }

  public async get(id:string ):Promise<T> {

    let cacheMgr = this;
    if(!this.cacheMap.contains(id)){
      this.refreshList.push(id);
    }

    if(this.refreshList.length > 0){
      await this.findListFromServer(this.refreshList).then((resultList:Array<T>)=>{
        cacheMgr.addListToCache(resultList);
        this.refreshList = new Array<string>();
      });
    }

    return new Promise<T>(resolve => {
      let target:T = this.findFromCache(id);
      resolve(target);
    });

  }

  public async getList(idArrayP:Array<string>):Promise<ZmMap<T>> {
    let idArray = AppUtils.uniquelize(idArrayP);
    this.checkList(idArray);

    let cacheMgr = this;
    if(this.refreshList.length >0){
      await this.findListFromServer(this.refreshList).then((returnList:Array<T>)=>{
        console.log("returnList"+returnList);
        cacheMgr.addListToCache(returnList);
        this.refreshList = new Array<string>();
      } );
    }

    return new Promise<ZmMap<T> >(resolve => {
      let targetList:Array<T> = this.findListFromCache(idArray);
      let targteMap:ZmMap<T> = cacheMgr.listToMap(targetList);

      resolve(targteMap);
    });

  }


  private listToMap(itemArray:Array<T>):ZmMap<T>{

    let targetMap = new ZmMap<T>();

    itemArray.forEach((itemTmp: T, index: number, array: T[])=>{

      targetMap.put(this.getId(itemTmp),itemTmp);
    });

    return targetMap;

  }

  private checkList(idArray:string[]){

    let notInCacheList = AppUtils.removeAll(idArray,this.cacheMap.keys());
    if( notInCacheList.length > 0){
      this.addRefreshList(notInCacheList);
    }
  }

  private addListToCache(targetList:Array<T>):void{
    targetList.forEach((targetTmp:T, index: number, array: T[])=>{
      this.cacheMap.put(this.getId(targetTmp),targetTmp);
    });
  }

  private findFromCache(id:string ):T{
    return this.cacheMap.get(id);
  }

  private findListFromCache(idArray:Array<string> ):Array<T>{

    let cacher = this;
    let targetList:Array<T> = new Array<T>();
    idArray.forEach((idTmp:string, index: number, array: string[])=>{

      let targetTmp:T = cacher.cacheMap.get(idTmp);
      if(!AppUtils.isNullObj(targetTmp)){
        targetList.push(targetTmp);
      }
    });
    return targetList;
  }

  //子类要覆盖该方法
  protected getId( target:T ):string {
    return null;
  }
  //子类要覆盖该方法
  protected findListFromServer( idArray:Array<string> ):Promise<Array<T>> {
    return null;
  }

}

