import {RestDaoError} from "./asynDao/RestDaoError";
import {ToastController, LoadingController, Loading} from "ionic-angular";


export class AppUtils {
  constructor() {
  }

  private static loadingCtrl: LoadingController;
  private static loading:Loading;
  public static setLoadingCtrl(loadingCtrlP:LoadingController){
    AppUtils.loadingCtrl = loadingCtrlP;
  }

  public  static showLoading(loadingIsOpen:boolean): void {
    if (!loadingIsOpen) {
      loadingIsOpen = true;
      this.loading = this.loadingCtrl.create({
        content:'loading...'
      });
      this.loading.present();
      setTimeout(() => {
        if(this.loading){
          loadingIsOpen && this.loading.dismiss();
        }
      }, 10000);
    }
  };

  public static hideLoading(loadingIsOpen:boolean): void {
    if(this.loading){
      loadingIsOpen && this.loading.dismiss();
    }
 };


  private static toaster:ToastController;
  public static setToaster(toasterP:ToastController){
    AppUtils.toaster = toasterP;
  }

  private static showToast(messageP: string, cssClassP: string) {
    let toast = AppUtils.toaster.create({
      showCloseButton: true,
      message: messageP,
      duration: 2000,
      position: "top",
      cssClass: cssClassP
    });

    toast.present();
  }

  public static showInfo(title: string, body: string){
    AppUtils.showToast(body, "info");
  }

  public static showSuccess(title: string, body: string){
    AppUtils.showToast(body, "success");
  }

  public static showWarn(title: string, body: string){
    AppUtils.showToast(body, "warn");
  }

  public static showError(title: string, body: string){
    AppUtils.showToast(body, "error");
  }


  public static delayExecute(fn,delayInMilli){
    setTimeout(()=>{
      fn();
    },delayInMilli);
  }

  public static showRestError(restError:RestDaoError){
    AppUtils.showInfo("", restError.tips);
  }

  //json utils....
  public static toJson(target:any):string{
    return JSON.stringify(target);
  }

  public static fromJsonToList<T>(tc:new()=>T,jsonStr:string):Array<T>{
    let targetList:Array<T>  = new Array<T>();
    let arrayTmp:Array<any> = JSON.parse(jsonStr);

    for (let tmpJson of arrayTmp) {

      let targetTmp = new tc();
      AppUtils.copy(targetTmp,tmpJson);
      if(targetTmp!=null){
        targetList.push(targetTmp);
      }
    }
    return targetList;
  }


  public static fromJson2Obj(jsonStr:string):any{
    return JSON.parse(jsonStr);
  }

  public static fromJson<T>(tc:new()=>T,jsonStr:string):T{
    let target:T = Object.assign(new tc(), JSON.parse(jsonStr));
    return target;
  }

  public static copyJson(target,jsonStr:string):void{
    Object.assign(target, JSON.parse(jsonStr));
  }

  public static copy(toObj:any, fromObj:any){
    Object.assign(toObj, fromObj);
  }

  //array utils...
  public static cloneArray(arrayTargetP:Array<any>):Array<any>{
    let arrayTmp:Array<any> = new Array<any>();
    return arrayTmp.concat(arrayTargetP);
  }

  public static addAll(arraySourceP:Array<any>,...arrayTargetsP:Array<any>):Array<any>{

    return arraySourceP.concat(arrayTargetsP);
  }

  public static insertArray(taretArray:Array<any>,index:number,item:any){
  // .splice(index, 0, item);
    taretArray.splice(index,0,item);
  }
  public static clearArray(taret:Array<any>){
    taret.length = 0;
  }

  public static removeAll(arraySourceP:Array<any>,arrayTargetP:Array<any>):Array<any>{
    return arraySourceP.filter((item)=>{
      return !AppUtils.arrayContains(arrayTargetP,item);
    });
  }

  //去重
  public static uniquelize(arraySourceP:Array<any>):Array<any>{
    let arrayTmp:Array<any> = new Array<any>();
    return arraySourceP.filter((item)=>{
      if(!AppUtils.arrayContains(arrayTmp,item)){
        arrayTmp.push(item);
        return true;
      }else{
        return false;
      }
    });
  }

  public static removeFromArray(arrayP:Array<any>,target:any){
    var index = arrayP.indexOf(target, 0);
    if (index > -1) {
      arrayP.splice(index, 1);
    }
  }
  public static arrayContains(arrayP:Array<any>,keyP:any):boolean{
    var index = arrayP.indexOf(keyP, 0);
    return index > -1;
  }

  public static isNullObj(value:any):boolean{
    return value == null || value == 'undefined';
  }

  public static isNotNullObjs( ...args): boolean {
    let notNull = true;

    for(let i = 0;i<args.length;i++){
      if(AppUtils.isNullObj(args[i])){
        notNull = false;
        break;
      }
    }
    return notNull;
  }

  //string utils...
  private static Empty: string = "";

  public static isNullOrWhiteSpace(value: string): boolean {
    try {
      if (value == null || value == 'undefined')
        return true;
      return value.replace(/\s/g, '').length < 1;
    }
    catch (e) {
      return false;
    }
  }

  // example: var testText = AppUtils.getInstance().format('{0}-{1}-{2}', "salutation", "chen", "allen");
  public static format(value, ...args): string {
    try {
      return value.replace(/{(\d+(:.*)?)}/g, function (match, i) {
        var s = match.split(':');
        if (s.length > 1) {
          i = i[0];
          match = s[1].replace('}', '');
        }

        var arg = args[i];
        return typeof arg != 'undefined' && arg != null ? arg : AppUtils.Empty;
      });
    }
    catch (e) {
      console.log("error app utils",e);
      return AppUtils.Empty;
    }
  }

  /**
   * 去掉字符串两边的空格 str不能为null
   */
  public static trimBlank(str:string){
    if(!str){
      return str;
    }
    return str.replace(/(^\s*)|(\s*$)/g, "");
  }

  /**
   * 两位小数
   */
  public static twoDecimal(str:number){
    let target = "";
    let strTmp = new Number(str);
    if(str!=null){
      target = strTmp.toFixed(2);
    }
    return parseFloat(target);
  }

  /**
   * 一位小数
   */
  public static aDecimal(str:number){
    let target = "";
    let strTmp = new Number(str);
    if(str!=null){
      target = strTmp.toFixed(1);
    }
    return parseFloat(target);
  }


  /**
   * 正则判断输入的是否为正整数  正整数返回true
   * @param num
   * @returns {boolean}
   */
  public static isPositiveInt(num:string):boolean {
    var reNum = /^[0-9]*[1-9][0-9]*$/;
    return reNum.test(num);
  }

  /**
   * 正则判断输入的是否为数字
   * @param num
   * @returns {boolean}
   */
  public static isNumber(num:string):boolean {
    var reNum = /(^(-?\d+)(\.\d+)?$)|(^-?\d+$)/;
    return reNum.test(num);
  }

  /**
   * 判断任意变量是否为number类型
   * @param num
   * @returns {boolean}
   */
  public static isNumberType(num):boolean{
    return (typeof(num)==="number")&&(num!==Infinity)&&!isNaN(num);
  }

  //对从json List<string>转成的 Array<number> 要做该处理
  public static toNumberList(inputList:Array<number>):Array<number>{
    if(inputList){
      return inputList.map((item)=>{
        return Number(item);
      })
    }else {
      return inputList;
    }

  }

  /**
   * 日期格式化  来源百度
   * @param date
   * @param fmt
   * @returns {string}
   */
  public static formatDate(date: Date, fmt: string): string {
    let o = {
      "M+": date.getMonth() + 1,                 //月份
      "d+": date.getDate(),                    //日
      "h+": date.getHours(),                   //小时
      "m+": date.getMinutes(),                 //分
      "s+": date.getSeconds(),                 //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      "S": date.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
    }
    return fmt;
  }

  /**
   * 字符串时间转为Date
   * @param {string} dateStr 输入的时间格式为yyyy-MM-dd hh:mm:ss
   * @returns {Date}
   */
  public static dateStrToDate(dateStr:string) :Date{
    try{
      let arr = dateStr.split(" ");
      let dateArr = arr[0].split('-');
      let timeArr = arr[1].split(":");
      let year = Number.parseInt(dateArr[0]);
      let month = Number.parseInt(dateArr[1])-1;
      let date = Number.parseInt(dateArr[2]);
      let hour = Number.parseInt(timeArr[0]);
      let minute = Number.parseInt(timeArr[1]);
      let second = Number.parseInt(timeArr[2]);
      let ms = 0;
      let resultDate = new Date(year, month, date, hour, minute, second, ms);
      return resultDate;
    } catch (err){
      return new Date();
    }
  }

  /**
   * 字符串时间转为Date
   * @param {string} timeStr 输入的时间格式为hh:mm
   * @returns {Date}
   */
  public static timeStrToDate(timeStr:string) :Date{
    try{
      let now = new Date();
      let timeArr = timeStr.split(":");
      let year = now.getFullYear();
      let month = now.getMonth();
      let date = now.getDate();
      let hour = Number.parseInt(timeArr[0]);
      let minute = Number.parseInt(timeArr[1]);
      let second = 0;
      let ms = 0;
      let resultDate = new Date(year, month, date, hour, minute, second, ms);
      return resultDate;
    } catch (err){
      return new Date();
    }
  }

  /**
   * 东八区Date转ISO时间字符串
   * @param {Date} date
   * @returns {string}
   */
  public static dateToISOString(date:Date) :string{
    let _8HOURS = 8 * 3600 * 1000;
    return new Date(+date + _8HOURS).toISOString();
  }

  /**
   * ISO时间字符串转东八区Date
   * @param {string} dateISOStr
   * @returns {Date}
   */
  public static isoStrToDate(dateISOStr: string): Date{
    let _8HOURS = 8 * 3600 * 1000;
    return new Date(new Date(dateISOStr).getTime() - _8HOURS);
  }

  /**
   * 拷贝属性值 不适用对象属性值未初始化情况
   * @param toObj
   * @param fromObj
   * @returns {any}
   */
  public static copyField(toObj:any, fromObj:any){
    if(typeof toObj == "object" && typeof fromObj == "object"){
      let fields = Object.keys(toObj);
      for(let index in fields){
        let field = fields[index];
        if(fromObj.hasOwnProperty(field) && fromObj[field]){
          toObj[field] = fromObj[field];
        }
      }
    }
    return toObj;
  }

  /**
   * 分页过滤数据
   */
  public static getPageData(curPage,dataArray){
    let pageSize = 10;
    let maxLength = curPage * pageSize-1;
    let minLength = curPage * pageSize - pageSize;
    let pageData = [];
    for(let i = minLength;i<dataArray.length;i++){
      if(maxLength<i){
        break;
      }else{
        pageData.push(dataArray[i]);
      }
    }
    return pageData;
  }

  public static checkBrowser():void{
    /*
     * 浏览器
     * chrome
     * firfox
     * qq浏览器 只支持极速模式(webkit内核) 兼容模式不支持
     * 360浏览器 只支持极速模式(webkit内核) 兼容模式不支持
     * IE浏览器 只支持IE11及以上
     */
    let userAgent = navigator.userAgent;
    if(userAgent.indexOf('Trident') > -1){
      alert('为了让您得到更好的网上浏览体验\n 1、切换到极速模式下进行浏览\n 2、使用的IE浏览器在IE10以上 ')
    }
  }

  /**
   * 格式化为对应位数的小数
   * @param numberRound 需要格式化的number
   * @param roundDigit 需要保留的位数
   * @returns {number}
   */
  public static roundPoint(numberRound:number,roundDigit:number):number{
    if(numberRound>=0){
      let tempNumber = parseInt((numberRound * Math.pow(10,roundDigit)+0.5).toString())/Math.pow(10,roundDigit);
      return tempNumber;
    }else{
      let numberRound1=-numberRound;
      let tempNumber = parseInt((numberRound1 * Math.pow(10,roundDigit)+0.5).toString())/Math.pow(10,roundDigit);
      return -tempNumber;
    }
  }

  public static fromObjArrToList<T>(tc:new()=>T,arrayTmp:Array<any>):Array<T>{
    let targetList:Array<T>  = new Array<T>();
    for (let tmpJson of arrayTmp) {
      let targetTmp = new tc();
      AppUtils.copy(targetTmp,tmpJson);
      if(targetTmp!=null){
        targetList.push(targetTmp);
      }
    }
    return targetList;
  }

  /**
   * dateP 格式eg：{year:2018,month:3,day:15}
   * 转化日期 最小时间 00:00:00
   * @returns {number}
   */
  public static getCurTimeTimeMillis():string {
    return new Date().getTime().toString();
  }

  /**
   * dateP 格式eg：{year:2018,month:3,day:15}
   * 转化日期 最小时间 00:00:00
   * @returns {number}
   */
  public static getMinTime(dateP):string {
    let arrTmp = [dateP.year, dateP.month, dateP.day];
    let date = new Date(arrTmp.join("/") + " 00:00:00");
    return date.getTime().toString();
  }

  /**
   * dateP 格式eg：{year:2018,month:3,day:15}
   * 转化日期 最大时间 23:59:59
   * @returns {number}
   */
  public static getMaxTime(dateP):string {
    let arrTmp = [dateP.year, dateP.month, dateP.day];
    let date = new Date(arrTmp.join("/") +" 23:59:59");
    return date.getTime().toString();
  }

  public static showMask(title: string) {
    let temp: any = `
          <p class="popup" style="position: fixed; top: 50%; left: 50%; -webkit-transform: translate(-50%, -50%); -moz-transform: translate(-50%, -50%); -ms-transform: translate(-50%, -50%); transform: translate(-50%, -50%); background: #fff; z-index: 9999; width: 450px; -moz-border-radius: 8px; border-radius: 8px; text-align: center; background: none;">${title}</p>
          <div class="mask" style="position: fixed; left: 0; top: 0; height: 100%; width: 100%; background: #000; opacity: .3; z-index: 9998;"></div>
        `;
    let z = document.createElement('div');
    z.className = 'pop-plu';
    z.innerHTML = temp;
    document.body.appendChild(z);
  }

  public static closeMask() {
    let z = document.getElementsByClassName("pop-plu")[0];
    document.body.removeChild(z);
  }

}


export class ReqMap {
  private map = new ZmMap();

  constructor() {
  }

  public add(keyP: string, valueP: string) {
    if (keyP) {
      this.map.put(keyP, valueP);
    }
    return this;
  }

  public toReqParam() {
    var keys = this.map.keys();
    var reqParam = "";
    for (var i = 0; i < keys.length; i++) {
      var keyTmp = keys[i];
      var value = this.map.get(keyTmp);
      reqParam = reqParam + keyTmp + "=" + value + "&";
    }
    return reqParam;
  }
}

export class ZmMap<T> {
  private data = {};
  private keyList = new Array<string>();

  constructor() {
  }

  public static newMap<K>(){
    return new ZmMap<K>();
  }

  public static fromMap<K>( tType: new() =>K, idName:string, inputMap:any):ZmMap<K>{
    let target = null;
    if(AppUtils.isNullObj(inputMap)){
      target = new ZmMap<K>();
      for(let index in inputMap){
        let targetTmp = new tType();
        AppUtils.copy(targetTmp,inputMap[index]);
        target.put(String(targetTmp[idName]),targetTmp);
      }
    }
    return target;
  }

  public put(keyP:string,valueP:T):ZmMap<T>{
    this.data[keyP] = valueP;
    if(!AppUtils.arrayContains(this.keyList,keyP)){
      this.keyList.push(keyP);
    }
    return this;
  }

  public get(keyP:string):T{
    return this.data[keyP];
  }

  public remove(keyP:string):T{

    AppUtils.removeFromArray(this.keyList,keyP);
    return this.data[keyP] = null;
  }

  public keys():Array<string>{
    return this.keyList;
  }

  public size():number{
    return this.keyList.length;
  }
  public values():Array<T>{
    let valueList = new Array<T>();
    this.keyList.forEach((keyTmp)=>{
      valueList.push(this.get(keyTmp));
    });
    return valueList;
  }

  public contains(keyP:string):boolean{
    return AppUtils.arrayContains(this.keyList,keyP);
  }

  public clear():void{
    this.data = {};
    this.keyList = new Array<string>();
  }

}
