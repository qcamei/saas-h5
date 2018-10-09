import {CUserUpdateInfoApiData} from "./CUserUpdateInfoApiData";
import {CUserChangePasswordApiData} from "./CUserChangePasswordApiData";
import {CUserAddressAddForm} from "./CUserAddressAddForm";
import {CUserAddressUpdateForm} from "./CUserAddressUpdateForm";
import {CUserAddressRemoveForm} from "./CUserAddressRemoveForm";
import {CUserChangeDefaultAddressForm} from "./CUserChangeDefaultAddressForm";

export class CUserUpdateApiForm {
    constructor(){}
    updateType:number;
    updateInfoData:CUserUpdateInfoApiData;
    changePasswordData:CUserChangePasswordApiData;
    addressAddData:CUserAddressAddForm;
    addressUpdateData:CUserAddressUpdateForm;
    addressRemoveData:CUserAddressRemoveForm;
    changeDefaultAddressData:CUserChangeDefaultAddressForm;
}
