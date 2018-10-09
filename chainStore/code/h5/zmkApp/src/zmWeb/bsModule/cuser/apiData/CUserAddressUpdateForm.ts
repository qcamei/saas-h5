import {AppUtils} from "../../../comModule/AppUtils";
import {DefaultFlagEnum} from "../data/DefaultFlagEnum";

export class CUserAddressUpdateForm {
    constructor(){}
    id:string;
    receiver:string;
    phone:string;
    addressArea:string;
    addressDetail:string;
    defaultFlag:number;
    addressPickerValue:string;

  public isValid(){
    return !AppUtils.isNullOrWhiteSpace(this.id)
      && !AppUtils.isNullOrWhiteSpace(this.receiver)
      && !AppUtils.isNullOrWhiteSpace(this.phone)
      && !AppUtils.isNullOrWhiteSpace(this.receiver)
      && !AppUtils.isNullOrWhiteSpace(this.addressArea)
      && !AppUtils.isNullOrWhiteSpace(this.addressDetail)
      && !AppUtils.isNullObj(this.defaultFlag)
      && (this.defaultFlag == DefaultFlagEnum.NON_DEFAULT || this.defaultFlag == DefaultFlagEnum.IS_DEFAULT)
      && !AppUtils.isNullOrWhiteSpace(this.addressPickerValue)
  }
}
