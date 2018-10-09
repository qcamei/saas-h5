import {AppUtils} from '../AppUtils';
import {RestResp} from '../RestResp';
import {AsyncRestProxy} from "./AsyncRestProxy";
import {SessionUtil} from "../SessionUtil";


export abstract class AsyncRestDao<T> {

  constructor(private tType: new() => T, private restProxy: AsyncRestProxy, private table: string) {
  }

  private getNew(): T {
    return new this.tType();
  }

  //获取service路径的方法 需要由子类实现
  abstract getService():string;

  public async add(targetP): Promise<T> {
    let uriPattern = "{0}/{1}/";
    let uri = AppUtils.format(uriPattern, this.getService(), this.table);
    let daoTmp = this;
    return new Promise<T>(resolve => {
      this.restProxy.add(uri, targetP).then( //then方法每次都会创建返回一个新的promise对象
        function (restResp) {
          let target: T = daoTmp.getTarget(restResp);
          resolve(target);
        }
      );
    });
  };

  public getTarget(restResp: RestResp): T {
    let targetTmp: T = null;
    if (restResp != null && !AppUtils.isNullOrWhiteSpace(restResp.tJson)) {
      targetTmp = this.getNew();
      AppUtils.copyJson(targetTmp, restResp.tJson);
    }
    return targetTmp;
  };



  private getTargetList(restResp: RestResp): T {
    let targetTmp: T = null;
    if (restResp != null && !AppUtils.isNullOrWhiteSpace(restResp.tListJson)) {
      targetTmp = this.getNew();
      AppUtils.copyJson(targetTmp, restResp.tListJson);
    }
    return targetTmp;
  };

  public delete(id): Promise<boolean> {
    let uriPattern = "{0}/{1}/{2}";
    let uri = AppUtils.format(uriPattern, this.getService(), this.table, id);
    return new Promise<boolean>(resolve => {
      this.restProxy.delete(uri).then(
        function (restResp) {
          resolve(restResp.code == 200);
        }
      );
    });
  };

  public update(targetP): Promise<boolean> {
    let uriPattern = "{0}/{1}/{2}";
    let id = targetP.storeId;
    let uri = AppUtils.format(uriPattern, this.getService(),this.table,id);
    return new Promise<boolean>(resolve => {
      this.restProxy.update(uri, targetP).then(
        function (restResp) {
          resolve(restResp.code == 200);
        }
      );
    });
  };

  public updateWithId(id, targetP): Promise<boolean> {
    let uriPattern = "{0}/{1}/{2}";
    let uri = AppUtils.format(uriPattern, this.getService(), this.table, id);
    return new Promise<boolean>(resolve => {
      this.restProxy.update(uri, targetP).then(
        function (restResp) {
          resolve(restResp.code == 200);
        }
      );
    });
  };

  public get(id): Promise<T> {
    //http://{sesrvice}/{table}/{id}
    let uriPattern = "{0}/{1}/{2}";
    let uri = AppUtils.format(uriPattern, this.getService(), this.table, id);
    let daoTmp = this;
    return new Promise<T>(resolve => {
      this.restProxy.get(uri).then(
        function (restResp) {
          let target: T = daoTmp.getTarget(restResp);
          resolve(target);
        }
      );
    });
  };

  public list(urlP): Promise<Array<T>> {

    return new Promise<Array<T>>(resolve => {
      this.restProxy.get(urlP).then(
        function (restResp) {
          let targetListTmp: Array<T> = new Array<T>();
          if (restResp != null && !AppUtils.isNullOrWhiteSpace(restResp.tListJson)) {
            targetListTmp = AppUtils.fromJsonToList<T>(this.tType, restResp.tListJson);
          }
          resolve(targetListTmp);
        }
      );
    });
  };

  public rawReq(uriPath, postParam):Promise<RestResp>{
    let uriPattern = "{0}/{1}/{2}";
    let uri = AppUtils.format(uriPattern, this.getService(), this.table, uriPath);
    return new Promise<RestResp>(resolve => {
      this.restProxy.rawReq(uri, postParam).then(
        function (restResp) {
          resolve(restResp);
        }
      );
    });
  };

  public findOneWithReqParam(uriPath, reqMap):Promise<T>{
    let uriPattern = "{0}/{1}/{2}?{3}";
    let reqParam = reqMap.toReqParam();
    let uri = AppUtils.format(uriPattern, this.getService(), this.table, uriPath,reqParam);
    let daoTmp = this;
    return new Promise<T>(resolve => {
      this.restProxy.get(uri).then(
        function (restResp) {
          let target: T = daoTmp.getTarget(restResp);
          resolve(target);
        }
      );
    });
  };

  public findListWithReqParam(findPath, reqMap, pageItemCount, pageNo):Promise<Array<T>>{
    let uriPattern = "{0}/{1}/{2}?pageItemCount={3}&pageNo={4}&{5}";
    let reqParam = reqMap.toReqParam();
    let uri = AppUtils.format(uriPattern, this.getService(), this.table, findPath, pageItemCount, pageNo, reqParam);
    let daoTmp = this;
    return new Promise<Array<T>>(resolve => {
      this.restProxy.list(uri).then(
        function (restResp) {
          let targetListTmp: Array<T> = new Array<T>();
          if (restResp != null && !AppUtils.isNullOrWhiteSpace(restResp.tListJson)) {
            targetListTmp = AppUtils.fromJsonToList<T>(daoTmp.tType, restResp.tListJson);
          }
          resolve(targetListTmp);
        }
      );
    });
  };

  public findList(findPath,pageItemCount, pageNo):Promise<Array<T>>{
    let uriPattern = "{0}/{1}/{2}?pageItemCount={3}&pageNo={4}";
    let uri = AppUtils.format(uriPattern, this.getService(), this.table, findPath, pageItemCount, pageNo);
    let daoTmp = this;
    return new Promise<Array<T>>(resolve => {
      this.restProxy.list(uri).then(
        function (restResp) {
          let targetListTmp: Array<T> = new Array<T>();
          if (restResp != null && !AppUtils.isNullOrWhiteSpace(restResp.tListJson)) {
            targetListTmp = AppUtils.fromJsonToList<T>(daoTmp.tType, restResp.tListJson);
          }
          resolve(targetListTmp);
        }
      );
    });
  };


  public sendSms(randomCodeAPIForm):Promise<RestResp>{
    let uriPattern  = "{0}/{1}/{2}";
    let uri = AppUtils.format(uriPattern,this.getService(),this.table,"sendRandomCode");
    return new Promise<RestResp>(resolve => {
      this.restProxy.rawReq(uri,randomCodeAPIForm).then(
        function (restResp) {
          // if(restResp != null && !AppUtils.isNullOrWhiteSpace(restResp.tJson)){
            // let target = AppUtils.fromJson(SmsResp, restResp.tJson);
            resolve(restResp);
        }
      );
    });
  }

  public addForm(addForm): Promise<T> {
    let uriPattern = "{0}/{1}/";
    let uri = AppUtils.format(uriPattern, this.getService(), this.table);
    let daoTmp = this;
    return new Promise<T>(resolve => {
      this.restProxy.add(uri, addForm).then(
        function (restResp) {
          if(restResp.code == 200){
            let target: T = daoTmp.getTarget(restResp);
            resolve(target);
          }else{
            resolve(null);
          }
        }
      );
    });
  };

  public updateFormByCond(updateForm,findPath): Promise<T> {
    let uriPattern = "{0}/{1}/{2}/";
    let uri = AppUtils.format(uriPattern, this.getService(), this.table,findPath);
    let daoTmp = this;
    return new Promise<T>(resolve => {
      this.restProxy.update(uri, updateForm).then(
        function (restResp) {
          if(restResp.code == 200){
            let target: T = daoTmp.getTarget(restResp);
            resolve(target);
          }else{
            resolve(null);
          }
        }
      );
    });
  };

  public addFormByCond(addForm,findPath): Promise<T> {
    let uriPattern = "{0}/{1}/{2}/";
    let uri = AppUtils.format(uriPattern, this.getService(), this.table,findPath);
    let daoTmp = this;
    return new Promise<T>(resolve => {
      this.restProxy.add(uri, addForm).then(
        function (restResp) {
          if(restResp.code == 200){
            let target: T = daoTmp.getTarget(restResp);
            resolve(target);
          }else{
            resolve(null);
          }
        }
      );
    });
  };



  public getWithReqParam(uriPath, reqMap):Promise<RestResp>{
    let uriPattern = "{0}/{1}/{2}?{3}";
    let reqParam = reqMap.toReqParam();
    let uri = AppUtils.format(uriPattern, this.getService(), this.table, uriPath,reqParam);
    return new Promise<RestResp>(resolve => {
      this.restProxy.get(uri).then(
        function (restResp) {
          resolve(restResp);
        }
      );
    });
  };

}
