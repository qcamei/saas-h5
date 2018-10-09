import {DefaultFlagEnum} from "./DefaultFlagEnum";

export class ReceiverAddress {
    constructor(){}
    id:string;
    receiver:string;
    phone:string;
    addressArea:string;
    addressDetail:string;
    defaultFlag:number = DefaultFlagEnum.NON_DEFAULT;
    addressPickerValue:string;

  /**
   * 拼接完整的收货地址
   * @returns {string}
   */
  public getFullAddressStr(){
    return this.addressArea + " " + this.addressDetail;
  }
}
