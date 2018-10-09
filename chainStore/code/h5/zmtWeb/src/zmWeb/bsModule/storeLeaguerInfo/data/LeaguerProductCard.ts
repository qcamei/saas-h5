
import {ProductCardItem} from "../../productCardDetail/data/ProductCardItem";
import {LeaguerPrdCardItem} from "./LeaguerPrdCardItem";
export class LeaguerProductCard{
  id:string;
  cardId:string;//次卡id 对应productCard id
  purchaseTime:string;//次卡购买时间
  endTime:string;//到期时间
  state:number;//次卡状态 对应PrdCardStateEnum
  createdTime:string;//创建时间
  leaguerPrdCardItems:Array<LeaguerPrdCardItem>;
  /************遗留字段***************/
  productCardItems:Array<ProductCardItem>;
  useCountMap:any;//使用次数 项目id对应项目剩余次数
  count:number;
}
