import {AppUtils} from "../../../comModule/AppUtils";
import {ProductInfoState} from "../data/ProductInfoState";
import {AddViewData} from "../../../views/storeProductInfo/productInfo/addProductInfo/addProductInfo";
import {PromotionFlagEnum} from "../../../comModule/enum/PromotionFlagEnum";
export class AddProductInfoData {

  index: number;
  storeId: string;
  name: string;
  number: string;
  typeId: string;
  price: number;
  cost: number;
  state: number;
  descript: string;
  imgPathList: Array<string>;
  defaultImg: string;
  promotionFlag: number;//PromotionFlagEnum
  promotionPrice: number;

  constructor() {
  }

  public static fromAddViewData(addFormTmp:AddViewData){
    let target = new AddProductInfoData();
    target.index = addFormTmp.index;
    target.number = AppUtils.trimBlank(addFormTmp.number);
    target.name = AppUtils.trimBlank(addFormTmp.name);
    target.typeId = addFormTmp.typeId;
    target.price = addFormTmp.price;
    target.cost = addFormTmp.cost;
    target.descript = addFormTmp.descript;
    target.defaultImg = addFormTmp.defaultImg;
    target.imgPathList = addFormTmp.imgPathList;
    target.defaultImg = addFormTmp.imgPathList[0];
    target.promotionPrice = addFormTmp.promotionPrice;
    addFormTmp.promotionFlag === true? target.promotionFlag = PromotionFlagEnum.Yes : target.promotionFlag = PromotionFlagEnum.No;
    addFormTmp.state === true? target.state = ProductInfoState.OPEN : target.state = ProductInfoState.CLOSE;
    return target;
  }
}
