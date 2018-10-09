export class GoodsDetail {
  constructor() {
  }

  id: string;
  chainId: number;
  number: string;
  name: string;
  namePass:boolean;

  typeId: string;
  sellPrice: number;
  defaultImg: string;
  cost: number;
  state: number;
  entityState: number;
  descript: string;
  imgPaths: Array<string>;
  applyStoreIds: Array<string>;
  createTime: number;
  lastUpdateTime: number;
  ver: number;

  checked: boolean = false;

  targetId(): string {
    return this.id;
  }
}
