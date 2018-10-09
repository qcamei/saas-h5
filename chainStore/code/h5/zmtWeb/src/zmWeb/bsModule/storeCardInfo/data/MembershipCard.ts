export class MembershipCard {

  id: string;

  number: string;

  name: string = "";

  freeMoney: number;

  prodDiscount: number = 10;

  goodsDiscount: number = 10;

  prdCardDiscount: number = 10;

  packagePrjDiscount: number = 10;

  status: number;

  imgPath: string;

  entityState: number;
  origin: number;// DataOriginEnum


//展示属性
  checked: boolean;

//遗留字段
  descript: string;

  createdTime: string;

  lastUpdateTime: string;


  constructor() {
  }
}
