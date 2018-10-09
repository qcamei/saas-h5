import {IntfDetailData} from "../../../comModule/dataDetail/IntfDetailData";
export class ProductDetail implements IntfDetailData{
  id: string;
  productId: string;
  storeId: string;

  number: string;
  name: string;
  typeId: string;
  state: number;
  entityState: number;

  descript: string;
  price: number;
  cost: number;
  imgPathList: Array<string>;
  defaultImg: string;
  origin:number;// DataOriginEnum
  topFlag: number;//TopFlagEnum
  promotionFlag: number;//PromotionFlagEnum
  promotionPrice: number;

  createTime: number;
  lastUpdateTime: number;
  ver: number;

  checked:boolean = false;

  targetId(): string {
    return this.id;
  }
}


