import {LeaguerUpdateInfoApiForm} from "./LeaguerUpdateInfoApiForm";
import {LeaguerAddApiForm} from "./LeaguerAddApiForm";
import {LeaguerDelApiForm} from "./LeaguerDelApiForm";
import {AddAttention} from "./AddAttention";
import {RemoveAttention} from "./RemoveAttention";
import {RechargeMemberCardForm} from './RechargeMemberCardForm';
import {UpdateMemberCardForm} from "./UpdateMemberCardForm";
import {PurchaseProductCardForm} from "./PurchaseProductCardForm";
import {ReduceProductCardCountForm} from "./ReduceProductCardCountForm";
// import {ExcelLeaguer} from "../../excel/apiData/ExcelLeaguer";
import {Leaguer} from "../data/Leaguer";
import {LeaguerLabelAddForm} from "./LeaguerLabelAddForm";
import {LeaguerLabelRemoveForm} from "./LeaguerLabelRemoveForm";
import {LeaguerLabelUpdateForm} from "./LeaguerLabelUpdateForm";

export class StoreLeaguerInfoUpdateApiForm {
  storeId: string;
  updateType: number;
  leaguerUpdateInfoData: LeaguerUpdateInfoApiForm;
  leaguerAddInfoData: LeaguerAddApiForm;
  leaguerDelInfoData: LeaguerDelApiForm;
  // addListFromExcel: Array<ExcelLeaguer>;
  addListFromStore: Array<Leaguer>;
  leaguerIds:string;
  addAttention: AddAttention;
  removeAttention: RemoveAttention;
  updateMemberCardForm: UpdateMemberCardForm;
  rechargeMemberCardForm: RechargeMemberCardForm;
  purchaseProductCardForm: PurchaseProductCardForm;
  reduceProductCardCountForm: ReduceProductCardCountForm;
  leaguerLabelAddForm:LeaguerLabelAddForm;
  leaguerLabelRemoveForm:LeaguerLabelRemoveForm;
  leaguerLabelUpdateForm:LeaguerLabelUpdateForm;
  leaguerLabelAddForms:Array<LeaguerLabelAddForm>;

  constructor() {
  }
}
