export class ProductDetail {
  constructor() {
  }

  id: string;
  chainId: number;
  number: string;
  name: string;
  namePass:boolean;

  typeId: string;
  state: number;
  entityState: number;
  defaultImg: string;
  sellPrice: number;
  cost: number;
  descript: string;
  imgPathList: Array<string>;
  applyStoreIds: Array<string>;
  createTime: number;
  lastUpdateTime: number;
  ver: number;

  checked: boolean = false;

  targetId(): string {
    return this.id;
  }
}
