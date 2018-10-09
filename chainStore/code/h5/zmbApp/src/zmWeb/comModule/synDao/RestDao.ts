import {AppUtils} from '../AppUtils';
import {RestProxy} from './RestProxy';
import {RestResp} from '../asynDao/apiData/RestResp';

export class RestDao<T> {

  //constructor of T
  // private constructorT: {new(): T;};

  constructor(private restProxy: RestProxy,private serviceAddress:string,private table:string) {
  }

  public add<T> (c:{new(): T;},targetP):T {
    //http://{sesrvice}/{table}/
    let uriPattern = "{0}/{1}/";
    let uri = AppUtils.format(uriPattern, [this.serviceAddress,this.table] );

    let restResp:RestResp = this.restProxy.add(uri,targetP);
    let target:T = this.getTarget(c,restResp);
    return target;

    // return new Promise<T>(resolve => {
    //   this.restProxy.add(uri,targetP).then(
    //     function (restResp) {
    //       let target:T = this.getTarget(c,restResp);
    //       resolve(target);
    //     }
    //   );
    // });
  };

  private getTarget<T>(c:{new(): T;},restResp:RestResp):T{
    let targetTmp:T = null;
    if(restResp!=null && !AppUtils.isNullOrWhiteSpace(restResp.tListJson)){
      targetTmp = AppUtils.fromJson<T>(c,restResp.tJson);
    }
    return targetTmp;
  }

  public delete (id):T {
    //http://{sesrvice}/{table}/{id}
    let uriPattern = "{0}/{1}/{2}";
    let uri = AppUtils.format(uriPattern, [this.serviceAddress,this.table, id] );
    this.restProxy.delete(uri);
    return null;

    // return new Promise<T>(resolve => {
    //   this.restProxy.delete(uri).then(
    //     function (restResp) {
    //       resolve(null);
    //     }
    //   );
    // });
  };

  public update<T> (c:{new(): T;},targetP):T {
    //http://{sesrvice}/{table}/{id}
    var uriPattern = "{0}/{1}/{2}";
    var id = targetP.id;
    var uri = AppUtils.format(uriPattern, [this.serviceAddress,this.table, id] );
    let restResp:RestResp = this.restProxy.update(uri,targetP);
    let target:T = this.getTarget(c,restResp);
    return target;

    // return new Promise<T>(resolve => {
    //   this.restProxy.update(uri,targetP).then(
    //     function (restResp) {
    //       let target:T = this.getTarget(c,restResp);
    //       resolve(target);
    //     }
    //   );
    // });
  };

  public get<T> (c:{new(): T;},id):T {
    //http://{sesrvice}/{table}/{id}
    var uriPattern = "{0}/{1}/{2}";
    var uri = AppUtils.format(uriPattern, [this.serviceAddress,this.table, id] );

    let restResp:RestResp = this.restProxy.get(uri);
    let target:T = this.getTarget(c,restResp);
    return target;
    // return new Promise<T>(resolve => {
    //   this.restProxy.get(uri).then(
    //     function (restResp) {
    //       let target:T = this.getTarget(c,restResp);
    //       resolve(target);
    //     }
    //   );
    // });
  };

  public list<T>(c:{new(): T;},urlP):Array<T> {

    let restResp:RestResp = this.restProxy.get(urlP);
    // let target:T = this.getTarget(c,restResp);
    let targetListTmp:Array<T> = new Array<T>();
    if(restResp!=null && !AppUtils.isNullOrWhiteSpace(restResp.tListJson)){
      targetListTmp = AppUtils.fromJsonToList(c,restResp.tListJson);
    }
    return targetListTmp;

    // return new Promise<Array<T>>(resolve => {
    //   this.restProxy.get(urlP).then(
    //     function (restResp) {
    //       let targetListTmp:Array<T> = new Array<T>();
    //       if(restResp!=null && !AppUtils.isNullOrWhiteSpace(restResp.listJson)){
    //         targetListTmp = AppUtils.fromJsonToList(c,restResp.listJson);
    //       }
    //       resolve(targetListTmp);
    //     }
    //   );
    // });
  };



}
