import {AppUtils} from "../../../comModule/AppUtils";
import {DefaultFlagEnum} from "../data/DefaultFlagEnum";

export class CUserAddressAddForm {
    constructor(){}
    index:number;
    receiver:string;
    phone:string;
    addressArea:string;
    addressDetail:string;
    defaultFlag:number;
    addressPickerValue:string;

    public isValid(){
      return !AppUtils.isNullObj(this.index)
        && this.index > 0
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
