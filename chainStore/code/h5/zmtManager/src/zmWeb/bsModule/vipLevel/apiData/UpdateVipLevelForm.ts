import {VipContent} from "../data/VipContent";
import {EditviewData} from "../../../views/vipLevel/editVipLevel/editVipLevel";
import {ValidPeriodUnitEnum} from "../data/ValidPeriodUnitEnum";
import {VipLevelStateEnum} from "../data/VipLevelStateEnum";
import {AppUtils} from "../../../comModule/AppUtils";
export class UpdateVipLevelForm {
  constructor() {
  }

  id: number;
  number: string;
  name: string;
  typeId: number;
  validPeriod: number;
  validPeriodUnit: number;
  openCharge: number;
  renewCharge: number;
  state: number;
  vipContent: VipContent;
  imgPaths: Array<string>;
  defualtImg: string;


  public static fromEditviewData(editviewData: EditviewData) {
    let editFormData = new UpdateVipLevelForm();
    editFormData.id = editviewData.id;
    editFormData.number = editviewData.number;
    editFormData.name = editviewData.name;
    editFormData.typeId = editviewData.typeId;
    editFormData.validPeriod = editviewData.validPeriod;
    editFormData.validPeriodUnit = ValidPeriodUnitEnum.MONTH;
    editFormData.openCharge = AppUtils.moneyY2F(editviewData.openCharge);
    editFormData.renewCharge = AppUtils.moneyY2F(editviewData.renewCharge);
    editFormData.vipContent = editviewData.vipContent;
    editviewData.state == true ? editFormData.state = VipLevelStateEnum.OPEN : editFormData.state = VipLevelStateEnum.CLOSE;
    return editFormData;
  }
}
