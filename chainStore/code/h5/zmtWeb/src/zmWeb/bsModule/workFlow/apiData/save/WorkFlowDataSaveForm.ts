import {LeaguerSaveForm} from "./LeaguerSaveForm";
import {DelimitCardRecordSaveForm} from "./DelimitCardRecordSaveForm";
import {BuyItemSaveForm} from "./BuyItemSaveForm";
import {DonateItemSaveForm} from "./DonateItemSaveForm";
import {BonusInfoSaveForm} from "./BonusInfoSaveForm";
import {MemCardInfo} from "../../data/MemCardInfo";
import {PreStoreCardRecordSaveForm} from "./PreStoreCardRecordSaveForm";
import {WfDataTypeEnum} from "./WfDataTypeEnum";
export class WorkFlowDataSaveForm {
  constructor() {
  }

  id: string;
  storeId: string;
  saveType: number;// 保存类型 WorkFlowDataSaveTypeEnum
  number: string;

  /**
   * @link{src/zmWeb/bsModule/workFlow/apiData/save/WfDataTypeEnum.ts}
   */
  recordType: number;// 开单类型 WfDataTypeEnum 补单、开单
  orderTime:number;//补单时间

  leaguerSaveForm: LeaguerSaveForm;
  preStoreCardRecordSaveForms: Array<PreStoreCardRecordSaveForm>;// 预存卡信息
  delimitCardRecordSaveForms: Array<DelimitCardRecordSaveForm>;
  buyItemSaveForms: Array<BuyItemSaveForm>;
  donateItemSaveForms: Array<DonateItemSaveForm>;
  bonusInfoSaveForms: Array<BonusInfoSaveForm>;

  //临时兼容以前的会员充值   后期应该会删除
  memCardInfo: MemCardInfo;

}
