export class UpdateProductInfoData {
  constructor() {
  }

  id: string;
  name: string;
  number: string;
  typeId: string;
  sellPrice: number;
  state: number;
  defaultImg: string;
  cost: number;
  descript: string;
  imgPathList: Array<string>;
  applyStoreIds: Array<string>;
}
