import {UpdateInfoData} from "./UpdateInfoData";
import {ChangePasswordData} from "./ChangePasswordData";
import {BUserVipRechargeData} from "./BUserVipRechargeData";
import {BUserUpdateVipTypeData} from "./BUserUpdateVipTypeData";

export class BUserUpdateApiForm {
  updateType: number;
  updateInfoData: UpdateInfoData;
  changePasswordData: ChangePasswordData;
  updateVipTypeData:BUserUpdateVipTypeData;//修改会员类型
  vipRechargeData:BUserVipRechargeData;//会员充值
}
