import {IntfDetailData} from "../../../comModule/dataDetail/IntfDetailData";
export class MembershipCardDetail implements IntfDetailData {
  constructor() {
  }

  id: string;
  storeId: number;
  number: string;
  name: string;
  freeMoney: number;
  prodDiscount: number;
  goodsDiscount: number;
  prdCardDiscount: number;
  packagePrjDiscount: number;
  status: number;
  entityState: number;
  descript: string;
  imgPath: string;
  createdTime: number;
  lastUpdateTime: number;
  ver: number;
  origin: number;// DataOriginEnum

  //展示属性
  checked: boolean = false;

  targetId(): string {
    return this.id;
  }
}
