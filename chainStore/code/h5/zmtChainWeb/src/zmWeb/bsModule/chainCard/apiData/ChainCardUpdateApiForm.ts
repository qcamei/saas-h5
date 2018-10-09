import {AddMembershipCard} from "./AddMembershipCard";
import {DelMembershipCard} from "./DelMembershipCard";
import {UpdMembershipCard} from "./UpdMembershipCard";
import {UpdMemberCardStateData} from "./UpdMemberCardStateData";
import {BatchUpdMemberCardStateData} from "./BatchUpdMemberCardStateData";
import {AddProductCardForm} from "./AddProductCardForm";
import {DelProductCardForm} from "./DelProductCardForm";
import {UpdProductCardForm} from "./UpdProductCardForm";
import {UpdProductCardStateData} from "./UpdProductCardStateData";
import {BatchUpdProductCardStateData} from "./BatchUpdProductCardStateData";
import {PrdCardTypeAddForm} from "./PrdCardTypeAddForm";
import {PrdCardTypeRemoveForm} from "./PrdCardTypeRemoveForm";
import {PrdCardTypeUpdateForm} from "./PrdCardTypeUpdateForm";
import {MemberCardAllotForm} from "./MemberCardAllotForm";
import {MemberCardBatchAllotForm} from "./MemberCardBatchAllotForm";
import {ProductCardAllotForm} from "./ProductCardAllotForm";
import {ProductCardBatchAllotForm} from "./ProductCardBatchAllotForm";

export class ChainCardUpdateApiForm {
    constructor(){}
    updateType:number;
    addMembershipCard:AddMembershipCard;
    addMembershipCardList:Array<AddMembershipCard>;
    delMembershipCard:DelMembershipCard;
    updMembershipCard:UpdMembershipCard;
    updateMemberCardStateData:UpdMemberCardStateData;
    batchUpdateMemberCardStateData:BatchUpdMemberCardStateData;

    addProductCard:AddProductCardForm;
    delProductCard:DelProductCardForm;
    updProductCard:UpdProductCardForm;
    updateProductCardStateData:UpdProductCardStateData;
    batchUpdateProductCardStateData:BatchUpdProductCardStateData;

    prdCardTypeAddForm:PrdCardTypeAddForm;
    prdCardTypeRemoveForm:PrdCardTypeRemoveForm;
    prdCardTypeUpdateForm:PrdCardTypeUpdateForm;

    memberCardAllotForm:MemberCardAllotForm;
    memberCardBatchAllotForm:MemberCardBatchAllotForm;
    productCardAllotForm:ProductCardAllotForm;
    productCardBatchAllotForm:ProductCardBatchAllotForm;
}
