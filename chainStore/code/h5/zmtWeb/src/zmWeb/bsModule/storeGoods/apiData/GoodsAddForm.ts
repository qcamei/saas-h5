import {AppUtils} from "../../../comModule/AppUtils";
import {GoodsStateEnum} from "../data/GoodsStateEnum";
import {AddViewData} from "../../../views/storeGoods/addGoods/addGoods";
import {PromotionFlagEnum} from "../../../comModule/enum/PromotionFlagEnum";
export class GoodsAddForm {
  index:number;
  number: string;
  name: string;
  namePass: boolean;
  typeId: string;
  price: number;
  cost: number;
  state: number;
  descript: string;
  imgPaths: Array<String>;
  defaultImg: string;
  promotionFlag: number;//PromotionFlagEnum
  promotionPrice: number;

  constructor() {
  }

  public static fromAddFormData(addFormTmp:AddViewData){
    let target = new GoodsAddForm();
    target.index = addFormTmp.index;
    target.number = AppUtils.trimBlank(addFormTmp.number);
    target.name = AppUtils.trimBlank(addFormTmp.name);
    target.typeId = addFormTmp.typeId;
    target.price = addFormTmp.price;
    target.cost = addFormTmp.cost;
    target.descript = addFormTmp.descript;
    target.defaultImg = addFormTmp.defaultImg;
    target.imgPaths = addFormTmp.imgPaths;
    target.defaultImg = addFormTmp.imgPaths[0];
    target.promotionPrice = addFormTmp.promotionPrice;
    addFormTmp.promotionFlag === true? target.promotionFlag = PromotionFlagEnum.Yes : target.promotionFlag = PromotionFlagEnum.No;
    addFormTmp.state === true? target.state = GoodsStateEnum.Open : target.state = GoodsStateEnum.Close;
    return target;
  }
}
