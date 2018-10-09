import {Subject, Subscription} from "rxjs";
import {MgrPool} from "../MgrPool";
import {ZmMap} from "../AppUtils";

/**
 * store监视器，切换store时，通知各个监听页面
 */
export class StoreMonitor {

  public static getInstance():StoreMonitor{
    return MgrPool.getInstance().get("StoreMonitor",StoreMonitor);
  }

  private monitor: Subject<any> = new Subject();

  private subMap = new ZmMap<Subscription>();

  public notify(): void {
    this.monitor.next(null);
  }

  public subscribe( page:any, func: () => void) {
    let key:string = page.constructor.name;
    let sub:Subscription = this.monitor.subscribe(func);
    this.subMap.put(key,sub);
  }

  public unSubscribe(page:any){
    let key:string = page.constructor.name;
    let sub:Subscription = this.subMap.remove(key);
    if(sub){
      sub.unsubscribe();
    }
  }

}
