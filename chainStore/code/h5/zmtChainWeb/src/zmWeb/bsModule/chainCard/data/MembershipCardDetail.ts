export class MembershipCardDetail {
  constructor() {
  }

  id: string;
  chainId: number;
  number: string;
  name: string;
  namePass: boolean;

  freeMoney: number;
  prodDiscount: number;
  goodsDiscount: number;
  prdCardDiscount: number;
  packagePrjDiscount: number;
  status: number;
  entityState: number;
  imgPath: string;
  descript: string;
  applyStoreIds: Array<string>;
  createdTime: number;
  lastUpdateTime: number;
  ver: number;

  checked: boolean = false;

  targetId(): string {
    return this.id;
  }
}
