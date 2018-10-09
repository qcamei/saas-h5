import {AddMembershipCard} from "./AddMembershipCard";
import {DelMembershipCard} from "./DelMembershipCard";
import {UpdMembershipCard} from "./UpdMembershipCard";
import {AddProductCardForm} from "./AddProductCardForm";
import {DelProductCardForm} from "./DelProductCardForm";
import {UpdProductCardForm} from "./UpdProductCardForm";
import {UpdMemberCardStateData} from "./UpdMemberCardStateData";
import {UpdProductCardStateData} from "./UpdProductCardStateData";
import {BatchUpdProductCardStateData} from "./BatchUpdProductCardStateData";
import {BatchUpdMemberCardStateData} from "./BatchUpdMemberCardStateData";
import {PrdCardTypeAddForm} from "./PrdCardTypeAddForm";
import {PrdCardTypeRemoveForm} from "./PrdCardTypeRemoveForm";
import {PrdCardTypeUpdateForm} from "./PrdCardTypeUpdateForm";
import {CardBatchCancelForm} from "./CardBatchCancelForm";
import {CardBatchPullForm} from "./CardBatchPullForm";
import {CardCancelForm} from "./CardCancelForm";
import {CardPullForm} from "./CardPullForm";
import {MemberCardBatchCancelForm} from "./MemberCardBatchCancelForm";
import {MemberCardBatchPullForm} from "./MemberCardBatchPullForm";
import {MemberCardCancelForm} from "./MemberCardCancelForm";
import {MemberCardPullForm} from "./MemberCardPullForm";
import {AddPrdCardTop} from "./AddPrdCardTop";
import {CancelPrdCardTop} from "./CancelPrdCardTop";
export class StoreCardInfoUpdateApiForm {

  updateType: number;

  addPrdCardTop: AddPrdCardTop;
  cancelPrdCardTop: CancelPrdCardTop;

  addMembershipCard: AddMembershipCard;
  addMembershipCardList: Array<AddMembershipCard>;
  delMembershipCard: DelMembershipCard;
  updMembershipCard: UpdMembershipCard;
  updateMemberCardStateData: UpdMemberCardStateData;
  batchUpdateMemberCardStateData: BatchUpdMemberCardStateData;

  addProductCard: AddProductCardForm;
  delProductCard: DelProductCardForm;
  updProductCard: UpdProductCardForm;
  updateProductCardStateData: UpdProductCardStateData;
  batchUpdateProductCardStateData: BatchUpdProductCardStateData;

  prdCardTypeAddForm: PrdCardTypeAddForm;
  prdCardTypeRemoveForm: PrdCardTypeRemoveForm;
  prdCardTypeUpdateForm: PrdCardTypeUpdateForm;

  /*************************连锁店数据同步**************************************/
  cardBatchCancelForm: CardBatchCancelForm;
  cardBatchPullForm: CardBatchPullForm;
  cardCancelForm: CardCancelForm;
  cardPullForm: CardPullForm;
  memberCardBatchCancelForm: MemberCardBatchCancelForm;
  memberCardBatchPullForm: MemberCardBatchPullForm;
  memberCardCancelForm: MemberCardCancelForm;
  memberCardPullForm: MemberCardPullForm;

  /*************************连锁店数据同步**************************************/

  constructor() {
  }
}

