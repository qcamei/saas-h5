import {ReceiverAddress} from "./ReceiverAddress";
import {AppUtils} from "../../../comModule/AppUtils";
import {DefaultFlagEnum} from "./DefaultFlagEnum";

export class CUser {
    constructor(){}
    id:string;
    name:string;
    phone:string;
    password:string;
    headImg:string;
    gender:number;
    age:number;
    addressIdIndex:number;
    addressMap:any;
    salt:string;
    leaguerIdSet:Array<string>;
    storeIdSet:Array<string>;
    createdTime:number;
    lastUpdateTime:number;
    ver:number;
    state:number;

    public getAddressList(): Array<ReceiverAddress> {
      let addressMap = this.addressMap;
      let addressArray = new Array<ReceiverAddress>();
      for (let key in addressMap) {
        let addressTmp = new ReceiverAddress();
        AppUtils.copy(addressTmp, addressMap[key]);
        addressArray.push(addressTmp);
      }
      return addressArray;
   }

   public getDefaultAddress(){
      let addressTmp = null;
      if(this.addressMap){
        let addressList = this.getAddressList();
        for(let i=0; i < addressList.length; i++){
          if(parseInt(addressList[i].defaultFlag+"") == DefaultFlagEnum.IS_DEFAULT){
            addressTmp = addressList[i];
            break;
          }
        }
        if(addressTmp == null && addressList.length > 0){
          addressTmp = addressList[0];
        }
      }
      if(addressTmp == null){
        addressTmp = new ReceiverAddress();
      }
      return addressTmp;
    }
}
