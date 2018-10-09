import {Constants} from "../../../views/zmComUtils/Constants";
export class Goods {
  id: string;
  number: string;
  name: string;
  typeId: string;
  state: number;
  entityState: number;
  price: number;
  defaultImg: string = Constants.GOODS_DEFAULT_IMG;
  origin:number;// DataOriginEnum
  topFlag: number;//TopFlagEnum
  promotionFlag: number;//PromotionFlagEnum
  promotionPrice: number;

  count:number = 0;

  //展示属性
  checked: boolean;
  constructor() {
  }
}

