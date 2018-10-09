import {BuyItemForCuser} from "./BuyItemForCuser";
export class PreOrderForCuserAddForm {
  constructor() {
  }

  leaguerId: string;
  memberCardId: string;
  cost: number;
  buyItemForCusers: Array<BuyItemForCuser>;
  storeId: string;
  creatorId: string;
  //快递信息OrderTrackTypeEnum
  type: number;
  receiver: string;
  phone: string;
  address: string;
}
