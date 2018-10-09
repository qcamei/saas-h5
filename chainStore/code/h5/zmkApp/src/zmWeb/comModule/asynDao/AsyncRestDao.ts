import {AppUtils, ReqMap} from '../AppUtils';
import {RestResp} from './apiData/RestResp';
import {AsyncRestProxy} from "./AsyncRestProxy";
import {PageResp} from "./apiData/PageResp";


export abstract class AsyncRestDao<T> {

  constructor(private tType: new() => T, private table: string) {
  }

  private getNew(): T {
    return new this.tType();
  }

  private getRestProxy():AsyncRestProxy{
    return AsyncRestProxy.getInstance();
  }

  //获取service路径的方法 需要由子类实现
  abstract getService():string;


  private getTarget(restResp: RestResp): T {
    let targetTmp: T = null;

    if (restResp != null && restResp.code == 200 && !AppUtils.isNullOrWhiteSpace(restResp.tJson)) {
      targetTmp = this.getNew();
      AppUtils.copyJson(targetTmp, restResp.tJson);
    }
    return targetTmp;
  };

  private getTargetList(restResp: RestResp): Array<T> {
    let targetListTmp:Array<T> = null;
    if (restResp != null  && restResp.code == 200 && !AppUtils.isNullOrWhiteSpace(restResp.tListJson)) {
      // targetListTmp = new Array<T>();
      targetListTmp = AppUtils.fromJsonToList<T>(this.tType, restResp.tListJson);
    }
    return targetListTmp;
  };

  private getTargetPage(restResp: RestResp): PageResp<T> {
    // let targetTmp: PageResp<T> = new PageResp<T>();
    // if (restResp != null  && restResp.code == 200 && !AppUtils.isNullOrWhiteSpace(restResp.tPageJson)) {
    //   let oriTarget:any = AppUtils.fromJson2Obj(restResp.tPageJson);
    //   AppUtils.copy(targetTmp, oriTarget);
    //   targetTmp.list = AppUtils.fromJsonToList(this.tType,oriTarget.list);
    // }
    // return targetTmp;
    let pageRespTmp = null;
    if(restResp && restResp.code == 200) {
      if (!AppUtils.isNullOrWhiteSpace(restResp.tJson)) {
        pageRespTmp = new PageResp<T>();
        AppUtils.copyJson(pageRespTmp, restResp.tJson); //可能会报错
        let listTmp: Array<T> = new Array<T>();
        if (pageRespTmp != null && !AppUtils.isNullObj(pageRespTmp.list)) {
          listTmp = AppUtils.fromObjArrToList(this.tType, pageRespTmp.list);
        }
        pageRespTmp.list = listTmp;
      }
    }
    return pageRespTmp;

  };

  private checkNetErro(restResp:RestResp):void{

    // if(restResp == null || restResp.code != 200){
    //   AppUtils.showError("错误","网络异常，请检查。");
    // }
  }

  public add(addForm): Promise<T> {
    let uriPattern = "{0}/{1}/";
    let uri = AppUtils.format(uriPattern, this.getService(), this.table);
    let daoTmp = this;
    return new Promise<T>(resolve => {
      this.getRestProxy().add(uri, addForm).then(
        function (restResp) {
          daoTmp.checkNetErro(restResp);
          let target: T = daoTmp.getTarget(restResp);
          resolve(target);
        }
      );
    });
  };

  public addWithUri(uriPath,addForm): Promise<T> {
    let uriPattern = "{0}/{1}/{2}";
    let uri = AppUtils.format(uriPattern, this.getService(), this.table,uriPath);
    let daoTmp = this;
    return new Promise<T>(resolve => {
      this.getRestProxy().add(uri,addForm).then(
        function (restResp) {
          daoTmp.checkNetErro(restResp);
          let target: T = daoTmp.getTarget(restResp);
          resolve(target);
        }
      );
    });
  };

  public delete(id): Promise<boolean> {
    let uriPattern = "{0}/{1}/{2}";
    let uri = AppUtils.format(uriPattern, this.getService(), this.table, id);
    let daoTmp = this;
    return new Promise<boolean>(resolve => {
      this.getRestProxy().delete(uri).then(
        function (restResp) {
          daoTmp.checkNetErro(restResp);
          resolve(restResp.code == 200);
        }
      );
    });
  };



  public updateWithId(id, targetP): Promise<boolean> {
    let uriPattern = "{0}/{1}/{2}";
    let uri = AppUtils.format(uriPattern, this.getService(), this.table, id);

    return new Promise<boolean>(resolve => {
      this.getRestProxy().update(uri, targetP).then(
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
      this.getRestProxy().get(uri).then(
        function (restResp) {
          daoTmp.checkNetErro(restResp);
          let target: T = daoTmp.getTarget(restResp);
          resolve(target);
        }
      );
    });
  };

  public getByUri(uriPath:string):Promise<T>{
    let uriPattern = "{0}/{1}/{2}/";
    let uri = AppUtils.format(uriPattern, this.getService(), this.table, uriPath);
    let daoTmp = this;
    return new Promise<T>(resolve => {
      this.getRestProxy().get(uri).then(
        function (restResp) {
          daoTmp.checkNetErro(restResp);
          let target: T = daoTmp.getTarget(restResp);
          resolve(target);
        }
      );
    });
  }

  public rawReq(uriPath, postParam):Promise<RestResp>{
    let uriPattern = "{0}/{1}/{2}";
    let uri = AppUtils.format(uriPattern, this.getService(), this.table, uriPath);
    // let daoTmp = this;
    return new Promise<RestResp>(resolve => {
      this.getRestProxy().rawReq(uri, postParam).then(
        function (restResp) {
          // if (restResp!=null && restResp.code == 200) {
            resolve(restResp);
          // }else{
          //   daoTmp.checkNetErro(restResp);
          //   resolve(null);
          // }
        }
      );
    });
  };

  public rawReq4FullPath(uriPath, postParam):Promise<RestResp>{
    // let daoTmp = this;
    return new Promise<RestResp>(resolve => {
      this.getRestProxy().rawReq(uriPath, postParam).then(
        function (restResp) {
          // if (restResp!=null && restResp.code == 200) {
            resolve(restResp);
          // }else{
          //   daoTmp.checkNetErro(restResp);
          //   resolve(null);
          // }
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
      this.getRestProxy().get(uri).then(
        function (restResp) {
          let target: T = daoTmp.getTarget(restResp);
          resolve(target);
        }
      );
    });
  };

  public findListWithReqParam(findPath:string, reqMap:ReqMap):Promise<Array<T>>{
    let uriPattern = "{0}/{1}/{2}?{3}";
    let reqParam = reqMap.toReqParam();

    let uri = AppUtils.format(uriPattern, this.getService(), this.table, findPath, reqParam);
    let daoTmp = this;
    return new Promise<Array<T>>(resolve => {
      this.getRestProxy().list(uri).then(
        function (restResp) {
          let targetListTmp: Array<T> = daoTmp.getTargetList(restResp);
          resolve(targetListTmp);
        }
      );
    });
  };

  public findPageWithReqParam(findPath:string, reqMap:ReqMap, pageNo:number):Promise<PageResp<T>>{
    let uriPattern = "{0}/{1}/{2}?pageNo={3}&{4}";
    let reqParam = reqMap.toReqParam();

    let uri = AppUtils.format(uriPattern, this.getService(), this.table, findPath, pageNo, reqParam);
    let daoTmp = this;
    return new Promise<PageResp<T>>(resolve => {
      this.getRestProxy().list(uri).then(
        function (restResp) {
          let targetPageTmp: PageResp<T> = daoTmp.getTargetPage(restResp);
          resolve(targetPageTmp);
        }
      );
    });
  };

  public findListByPageWithReqParam(findPath:string, reqMap:ReqMap, pageItemCount:number, pageNo:number):Promise<Array<T>>{
    let uriPattern = "{0}/{1}/{2}?pageItemCount={3}&pageNo={4}&{5}";
    let reqParam = reqMap.toReqParam();

    let uri = AppUtils.format(uriPattern, this.getService(), this.table, findPath, pageItemCount, pageNo, reqParam);
    let daoTmp = this;
    return new Promise<Array<T>>(resolve => {
      this.getRestProxy().list(uri).then(
        function (restResp) {
          let targetListTmp: Array<T> = daoTmp.getTargetList(restResp);
          resolve(targetListTmp);
        }
      );
    });
  };

  public getWithReqParam(uriPath, reqMap):Promise<RestResp>{
    let uriPattern = "{0}/{1}/{2}?{3}";
    let reqParam = reqMap.toReqParam();
    let uri = AppUtils.format(uriPattern, this.getService(), this.table, uriPath,reqParam);
    return new Promise<RestResp>(resolve => {
      this.getRestProxy().get(uri).then(
        function (restResp) {
          resolve(restResp);
        }
      );
    });
  };

  /**
   * 分页PageResp
   * @param uriPath
   * @param reqMap
   * @param typeP
   * @returns {Promise<PageResp>}
   */
  public getPageRespByType<K>(uriPath, reqMap,typeP: new() => K):Promise<PageResp<K>>{
    let uriPattern = "{0}/{1}/{2}?{3}";
    let reqParam = reqMap.toReqParam();
    let uri = AppUtils.format(uriPattern, this.getService(), this.table, uriPath,reqParam);
    return new Promise<PageResp<K>>(resolve => {
      this.getRestProxy().get(uri).then(
        function (restResp) {
          if(restResp.code == 200){
            let pageRespTmp = null;
            if (!AppUtils.isNullObj(restResp) && !AppUtils.isNullOrWhiteSpace(restResp.tJson)) {
              pageRespTmp = new PageResp<K>();
              AppUtils.copyJson(pageRespTmp, restResp.tJson);
              let listTmp: Array<K> = new Array<K>();
              if (pageRespTmp != null && !AppUtils.isNullObj(pageRespTmp.select)) {
                listTmp = AppUtils.fromObjArrToList(typeP,pageRespTmp.select);
              }
              pageRespTmp.select = listTmp;
            }
            resolve(pageRespTmp);
          }else{
            resolve(null);
          }
        }
      );
    });
  };

  public upLoadFile(uriPath,formData):Promise<RestResp>{
    let uriPattern = "{0}/{1}/{2}/";
    let uri = AppUtils.format(uriPattern, this.getService(), this.table, uriPath);
    return new Promise<RestResp>(resolve => {
      this.getRestProxy().uploadFile(uri,formData).then(
        function (restResp) {
          resolve(restResp);
        }
      );
    });
  };

}
