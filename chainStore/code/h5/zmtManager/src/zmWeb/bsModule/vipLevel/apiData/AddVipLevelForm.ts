import {VipContent} from "../data/VipContent";
import {VipLevelStateEnum} from "../data/VipLevelStateEnum";
import {AddviewData} from "../../../views/vipLevel/addVipLevel/addVipLevel";
import {ValidPeriodUnitEnum} from "../data/ValidPeriodUnitEnum";
import {AppUtils} from "../../../comModule/AppUtils";
export class AddVipLevelForm {
  constructor() {
  }

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


  public static fromAddviewData(addviewData: AddviewData) {
    let addFormData = new AddVipLevelForm();
    addFormData.number = addviewData.number;
    addFormData.name = addviewData.name;
    addFormData.typeId = addviewData.typeId;
    addFormData.validPeriod = addviewData.validPeriod;
    addFormData.validPeriodUnit = ValidPeriodUnitEnum.MONTH;
    addFormData.openCharge = AppUtils.moneyY2F(addviewData.openCharge);
    addFormData.renewCharge = AppUtils.moneyY2F(addviewData.renewCharge);
    addFormData.vipContent = addviewData.vipContent;
    addFormData.imgPaths = addviewData.imgPaths;
    addFormData.defualtImg = addviewData.defualtImg;
    addviewData.state == true ? addFormData.state = VipLevelStateEnum.OPEN : addFormData.state = VipLevelStateEnum.CLOSE;
    return addFormData;
  }
}
