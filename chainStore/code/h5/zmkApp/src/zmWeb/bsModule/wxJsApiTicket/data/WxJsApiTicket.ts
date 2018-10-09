import {JsApiConfig} from "../../../views/zmComUtils/WXUtils";

export class WxJsApiTicket {
    constructor(){}
    id:number;

    appId: string;
    timestamp: string;
    nonceStr: string;
    signature: string;

    createdTime:number;
    lastUpdateTime:number;
    ver:number;

    public toJsApiConfig(): JsApiConfig{
      let target = new JsApiConfig();
      target.appId = this.appId;
      target.timestamp = this.timestamp;
      target.nonceStr = this.nonceStr;
      target.signature = this.signature;
      return target;
    }
}
