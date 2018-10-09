import {IntfDetailData} from "../../../comModule/dataDetail/IntfDetailData";
export class GoodsDetail implements IntfDetailData{
  id: string;
  goodsId: string;
  storeId: string;

  number: string;
  name: string;
  typeId: string;
  price: number;
  cost: number;
  state: number;
  descript: string;
  entityState: number;
  imgPaths: Array<string>;
  defaultImg: string;
  origin:number;// DataOriginEnum
  topFlag: number;//TopFlagEnum
  promotionFlag: number;//PromotionFlagEnum
  promotionPrice: number;

  createTime: number;
  lastUpdateTime: number;
  ver: number;

  checked:boolean = false;


  targetId():string{
    return this.id.toString();
  }
}
