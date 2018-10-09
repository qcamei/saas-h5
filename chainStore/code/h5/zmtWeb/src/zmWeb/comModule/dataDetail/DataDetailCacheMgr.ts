import {DataVersionEnum} from "./DataVersionEnum";
import {ZmMap, AppUtils} from "../AppUtils";

/**
 * 店铺相关域（会员、项目、商品）缓存
 */
export class DataDetailCacheMgr{

  private static instance:DataDetailCacheMgr = new DataDetailCacheMgr();

  private detailCacheMap:ZmMap<any> = new ZmMap<any>();

  public static getInstance():DataDetailCacheMgr{
    return DataDetailCacheMgr.instance;
  }

  public putData(dataVersionEnum:DataVersionEnum, id:string, ver:number, data:any) {
    if(!AppUtils.isNullObj(data) && !AppUtils.isNullOrWhiteSpace(id)){
      this.removeItemVers(dataVersionEnum,id);
      let key = this.getKey(dataVersionEnum,id,ver);
      this.detailCacheMap.put(key,data);
      // console.log("DataDetailCacheMgr.putData======"+key);
    }
  }

  public getData(dataVersionEnum:DataVersionEnum, id:string, ver:number):any {
    let key = this.getKey(dataVersionEnum,id,ver);
    return this.detailCacheMap.get(key)?this.detailCacheMap.get(key):null;
  }

  /**
   * 删除整个枚举域（会员/项目）的缓存
   * @param dataVersionEnum
   */
  public removeTableCache(dataVersionEnum:DataVersionEnum) {
    this.detailCacheMap.keys().forEach((key:string)=>{
      let keyArr = key.split("_");
      if(keyArr[1] > dataVersionEnum.toString()){
        this.detailCacheMap.remove(key);
      }
    })
  }

  /**
   * 清空所有缓存
   */
  public clear() {
    this.detailCacheMap.clear();
  }

  /**
   * 删除不同版本的缓存
   * @param dataVersionEnum
   * @param id
   */
  private removeItemVers(dataVersionEnum:DataVersionEnum,id:string){
    let format:string = "{0}_{1}";
    let param:string = AppUtils.format(format,dataVersionEnum,id);
    this.detailCacheMap.keys().forEach((key:string)=>{
      let paramTmp:string = key.slice(0,key.lastIndexOf("_"));
      if(paramTmp == param){
        this.detailCacheMap.remove(key);
      }
    })
  }

  private getKey(dataVersionEnum:DataVersionEnum,id:string,ver:number):string{
    let format:string = "{0}_{1}_{2}";
    let key:string = AppUtils.format(format,dataVersionEnum,id,ver);
    return key;
  }

}
